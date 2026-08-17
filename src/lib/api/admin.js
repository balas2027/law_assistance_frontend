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

export async function fetchAdminStatsApi() {
  const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeaders() });
  return handle(res);
}

export async function fetchAdminUsersApi({ skip = 0, limit = 50 } = {}) {
  const res = await fetch(`${API_BASE}/admin/users?skip=${skip}&limit=${limit}`, { headers: getAuthHeaders() });
  return handle(res);
}

