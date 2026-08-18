const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem('nyayaai-auth') || '{}')?.state?.token;
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function handle(res) {
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const detail = typeof data.detail === 'string' ? data.detail : data.detail?.[0]?.msg || 'Request failed';
    throw new Error(detail);
  }
  return data;
}

// ── Lesson progress ──────────────────────────────────────────────────────────

export async function fetchLessonCompletionStatusApi(lessonId) {
  const res = await fetch(`${API_BASE}/progress/lessons/${lessonId}/status`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function markLessonCompletedApi(lessonId) {
  const res = await fetch(`${API_BASE}/progress/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

export async function unmarkLessonCompletedApi(lessonId) {
  const res = await fetch(`${API_BASE}/progress/lessons/${lessonId}/complete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handle(res);
}

// ── Academy dashboard stats ──────────────────────────────────────────────────

export async function fetchAcademyStatsApi() {
  const res = await fetch(`${API_BASE}/progress/academy-stats`, { headers: getAuthHeaders() });
  return handle(res);
}
