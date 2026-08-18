import { API_BASE } from '../api_endpoint';

function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem('nyayaai-auth') || '{}')?.state?.token;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function handle(res) {
  let data = {};
  try {
    data = await res.json();
  } catch {
    // empty body
  }
  if (!res.ok) {
    const detail = typeof data.detail === 'string' ? data.detail : data.detail?.[0]?.msg || 'Request failed';
    throw new Error(detail);
  }
  return data;
}

// ── Topics ───────────────────────────────────────────────────────────────────

export async function fetchTopicsApi() {
  const res = await fetch(`${API_BASE}/cms/topics`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function createTopicApi(payload) {
  const res = await fetch(`${API_BASE}/cms/topics`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// ── Quizzes (CMS) ────────────────────────────────────────────────────────────

export async function fetchCmsQuizzesApi() {
  const res = await fetch(`${API_BASE}/cms/quizzes`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchCmsQuizApi(quizId) {
  const res = await fetch(`${API_BASE}/cms/quizzes/${quizId}`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function createQuizApi(payload) {
  const res = await fetch(`${API_BASE}/cms/quizzes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function updateQuizApi(quizId, payload) {
  const res = await fetch(`${API_BASE}/cms/quizzes/${quizId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function publishQuizApi(quizId) {
  const res = await fetch(`${API_BASE}/cms/quizzes/${quizId}/publish`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

export async function unpublishQuizApi(quizId) {
  const res = await fetch(`${API_BASE}/cms/quizzes/${quizId}/unpublish`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handle(res);
}