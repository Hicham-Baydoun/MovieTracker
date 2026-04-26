// Base URL comes from the environment — localhost in dev, Render URL in production
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// Central fetch wrapper used by every API call in the app.
// credentials: 'include' sends the httpOnly JWT cookie automatically on every request.
// Throws with the server's error message so callers can display it directly.
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { message?: string }).message ?? res.statusText);
  return body as T;
}
