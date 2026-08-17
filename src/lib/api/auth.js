const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

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

export async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handle(res);
  return { token: data.access_token, user: data.user };
}

export async function signupApi({ name, email, password, role }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: name, email, password, user_type: role }),
  });
  const data = await handle(res);
  return { token: data.access_token, user: data.user };
}

export async function meApi(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function logoutApi() {
  return Promise.resolve();
}
