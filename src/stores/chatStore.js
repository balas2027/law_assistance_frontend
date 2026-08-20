import { create } from 'zustand';
import {
  createChatApi,
  createChatSessionApi,
  fetchChatApi,
  fetchChatSessionApi,
  fetchChatsApi,
  fetchChatSessionsApi,
  saveChatSessionApi,
  sendChatMessageApi,
  sendMessageApi,
} from '../lib/api/chat';
import { demoChatSession } from '../types/chat';
import { uid } from '../lib/utils';
import { useLanguageStore } from './languageStore';

function hasAuthToken() {
  return !!JSON.parse(localStorage.getItem('nyayaai-auth') || '{}')?.state?.token;
}

function mapSessionSummary(session) {
  return {
    id: String(session.id),
    title: session.title || 'Untitled Chat',
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    messageCount: session.message_count,
    lastMessage: session.last_message,
    messages: [],
  };
}

function mapSessionDetail(session) {
  return {
    id: String(session.id),
    title: session.title || 'Untitled Chat',
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    messages: (session.messages || []).map((m) => ({
      id: String(m.id),
      role: m.role,
      content: m.content,
      source_type: m.source_type,
      is_error: m.is_error,
      timestamp: m.created_at,
      sources: (m.sources || []).map((s) => ({ ...s, metadata: s.metadata || {} })),
    })),
  };
}

export const useChatStore = create((set, get) => ({
  chats: hasAuthToken() ? [] : [demoChatSession],
  activeChat: hasAuthToken() ? null : demoChatSession,
  messages: hasAuthToken() ? [] : demoChatSession.messages,
  loading: false,
  selectedSourceType: 'all',

  setSelectedSourceType: (sourceType) => set({ selectedSourceType: sourceType }),

  loadChats: async () => {
    set({ loading: true });
    try {
      if (!hasAuthToken()) throw new Error('Not authenticated');
      const sessions = await fetchChatSessionsApi();
      set({ chats: sessions.map(mapSessionSummary), loading: false });
    } catch {
      const chats = await fetchChatsApi();
      set({ chats, loading: false });
    }
  },

  selectChat: async (chatId) => {
    set({ loading: true });
    try {
      if (!hasAuthToken()) throw new Error('Not authenticated');
      const chat = await fetchChatSessionApi(chatId);
      const mapped = mapSessionDetail(chat);
      set({ activeChat: mapped, messages: mapped.messages, loading: false });
      return mapped;
    } catch {
      const chat = await fetchChatApi(chatId);
      set({ activeChat: chat, messages: chat.messages || [], loading: false });
      return chat;
    }
  },

  newChat: async (prompt) => {
    try {
      if (hasAuthToken()) {
        const session = await createChatSessionApi({
          title: prompt && prompt.trim() ? prompt.trim().slice(0, 40) : null,
        });
        const mapped = mapSessionDetail(session);
        set((state) => ({ chats: [mapped, ...state.chats], activeChat: mapped, messages: [] }));
        return mapped;
      }
      throw new Error('Not authenticated');
    } catch {
      const chat = await createChatApi(prompt);
      set((state) => ({ chats: [chat, ...state.chats], activeChat: chat, messages: [] }));
      return chat;
    }
  },

  sendMessage: async (content) => {
    const userMessage = {
      id: uid('msg'),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...get().messages, userMessage];
    set({ messages: newMessages, loading: true });

    const currentLanguage = useLanguageStore.getState().preferred_language;

    let assistantMessage;
    let backendSession = null;
    try {
      const activeChat = get().activeChat;
      const isBackendSession =
        activeChat && /^\d+$/.test(String(activeChat.id)) && hasAuthToken();

      if (isBackendSession) {
        const response = await sendChatMessageApi(activeChat.id, {
          query: content,
          source_type: get().selectedSourceType,
          top_k: 5,
        });
        const msg = response.message;
        assistantMessage = {
          id: String(msg.id),
          role: msg.role,
          timestamp: msg.created_at,
          content: msg.content,
          source_type: msg.source_type,
          is_error: msg.is_error,
          sources: (msg.sources || []).map((s) => ({ ...s, metadata: s.metadata || {} })),
        };
        backendSession = response.session;
      } else {
        const response = await sendMessageApi({
          query: content,
          source_type: get().selectedSourceType,
          top_k: 5,
          selected_language: currentLanguage,
      });
        assistantMessage = {
          id: uid('msg'),
          role: 'assistant',
          timestamp: new Date().toISOString(),
          content: response.answer,
          source_type: response.source_type,
          sources: response.sources || [],
          language_mismatch_suggestion: response.language_mismatch_suggestion || null,
      };
      }
    } catch (error) {
      assistantMessage = {
        id: uid('msg'),
        role: 'assistant',
        timestamp: new Date().toISOString(),
        content: `I encountered an issue retrieving legal information: ${error.message || 'Unable to connect to service'}. Please verify that the backend API server is running.`,
        isError: true,
        sources: [],
        language_mismatch_suggestion: null,
      };
    }

    const updatedMessages = [...get().messages, assistantMessage];
    const currentActive = get().activeChat || {};

    let updatedActiveChat;
    if (backendSession) {
      updatedActiveChat = {
        ...currentActive,
        id: String(backendSession.id),
        title: backendSession.title || currentActive.title,
        updatedAt: backendSession.updated_at,
        messages: updatedMessages,
      };
    } else {
      updatedActiveChat = {
        ...currentActive,
        title:
          currentActive.title && currentActive.title !== 'New Legal Query'
            ? currentActive.title
            : content.slice(0, 40),
        updatedAt: new Date().toISOString(),
        messages: updatedMessages,
      };
    }

    set({ messages: updatedMessages, activeChat: updatedActiveChat, loading: false });

    if (!backendSession) {
      saveChatSessionApi(updatedActiveChat).catch(() => {});
    }

    return assistantMessage;
  },

  reset: () =>
    set({
      chats: hasAuthToken() ? [] : [demoChatSession],
      activeChat: hasAuthToken() ? null : demoChatSession,
      messages: hasAuthToken() ? [] : demoChatSession.messages,
      loading: false,
      selectedSourceType: 'all',
    }),
}));

