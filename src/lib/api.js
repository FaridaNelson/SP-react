export const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const opts = {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  };
  if (opts.body && typeof opts.body !== "string") {
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, opts);
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok)
    throw new Error(data?.error || data || `Request failed: ${res.status}`);
  return data;
}
