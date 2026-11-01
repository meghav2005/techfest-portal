const BASE = import.meta.env.VITE_API_URL || '/api';

// credentials: 'include' sends the httpOnly cookie; X-Requested-With is the CSRF guard the API checks.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.errors?.join('. ') || data.message || 'Request failed');
  return data;
}
