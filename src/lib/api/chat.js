import { API_BASE } from '../api_endpoint';
import { demoChatSession } from '../../types/chat';

const LOCAL_STORAGE_KEY = 'nyaya_ai_chats_v1';

function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem('nyayaai-auth') || '{}')?.state?.token;
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

function getStoredChats() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStoredChats(chats) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats));
  } catch {
    // ignore storage errors
  }
}

async function handle(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    // ignore empty body
  }
  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : data.detail?.[0]?.msg || 'Request failed';
    throw new Error(detail);
  }
  return data;
}

// ── Backend (persistent, per-user) ────────────────────────────────────────

export async function fetchChatSessionsApi() {
  const res = await fetch(`${API_BASE}/chat/sessions`, { headers: getAuthHeaders() });
  const data = await handle(res);
  return data.sessions || [];
}

export async function createChatSessionApi({ title = null } = {}) {
  const res = await fetch(`${API_BASE}/chat/sessions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title: title || null }),
  });
  return handle(res);
}

export async function fetchChatSessionApi(sessionId) {
  const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
    headers: getAuthHeaders(),
  });
  return handle(res);
}

export async function sendChatMessageApi(sessionId, { query, source_type = null, top_k = 5 }) {
  const payload = { query, top_k };
  if (source_type && source_type !== 'all') {
    payload.source_type = source_type;
  }
  const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function deleteChatSessionApi(sessionId) {
  const res = await fetch(`${API_BASE}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    return handle(res);
  }
  return null;
}

// ── Local fallback (offline / unauthenticated) ────────────────────────────

export async function fetchChatConfigApi() {
  const res = await fetch(`${API_BASE}/chat/config`);
  return handle(res);
}

export async function fetchChatsApi() {
  const stored = getStoredChats();
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return Promise.resolve(stored);
  }
  const defaultChats = [demoChatSession];
  saveStoredChats(defaultChats);
  return Promise.resolve(defaultChats);
}

export async function fetchChatApi(chatId) {
  const chats = await fetchChatsApi();
  const found = chats.find((c) => c.id === chatId);
  if (found) return found;
  const newSession = {
    id: chatId,
    title: 'New Legal Query',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };
  return newSession;
}

export async function createChatApi(prompt) {
  const title = prompt.trim() ? (prompt.length > 40 ? `${prompt.slice(0, 40)}...` : prompt) : 'New Legal Query';
  const chat = {
    id: `chat_${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  const chats = await fetchChatsApi();
  const updatedChats = [chat, ...chats];
  saveStoredChats(updatedChats);
  return chat;
}

export async function saveChatSessionApi(updatedChat) {
  const chats = await fetchChatsApi();
  const index = chats.findIndex((c) => c.id === updatedChat.id);
  let updated;
  if (index >= 0) {
    updated = [...chats];
    updated[index] = updatedChat;
  } else {
    updated = [updatedChat, ...chats];
  }
  saveStoredChats(updated);
  return updatedChat;
}

export async function sendMessageApi({ query, source_type = null, top_k = 5, selected_language = null }) {
  const payload = { query, top_k };
  if (source_type && source_type !== 'all') {
    payload.source_type = source_type;
  }
  if (selected_language) {
    payload.selected_language = selected_language;
  }

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handle(res);
}

