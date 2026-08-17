const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

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

// ── Quizzes ──────────────────────────────────────────────────────────────────

export async function fetchQuizzesApi({ topicId } = {}) {
  const url = topicId ? `${API_BASE}/quiz?topic_id=${topicId}` : `${API_BASE}/quiz`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchQuizApi(quizId) {
  const res = await fetch(`${API_BASE}/quiz/${quizId}`, { headers: getAuthHeaders() });
  return handle(res);
}

// ── Attempts ─────────────────────────────────────────────────────────────────

export async function startAttemptApi(quizId) {
  const res = await fetch(`${API_BASE}/quiz/${quizId}/attempts`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

export async function submitAnswerApi(attemptId, questionId, selectedOptionId) {
  const res = await fetch(`${API_BASE}/quiz/attempts/${attemptId}/answers`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ question_id: questionId, selected_option_id: selectedOptionId }),
  });
  return handle(res);
}

export async function completeAttemptApi(attemptId) {
  const res = await fetch(`${API_BASE}/quiz/attempts/${attemptId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

// ── User performance ─────────────────────────────────────────────────────────

export async function fetchUserStatsApi() {
  const res = await fetch(`${API_BASE}/users/me/stats`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchUserQuizProgressApi() {
  const res = await fetch(`${API_BASE}/users/me/quiz-progress`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchTopicProgressApi() {
  const res = await fetch(`${API_BASE}/users/me/topics/progress`, { headers: getAuthHeaders() });
  return handle(res);
}