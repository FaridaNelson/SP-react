export const API_BASE = import.meta.env.VITE_API_BASE || "";

let csrfToken = null;

async function getCsrfToken() {
  if (csrfToken) return csrfToken;

  const res = await fetch(`${API_BASE}/api/csrf-token`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CSRF token");
  }

  const data = await res.json();
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function api(path, options = {}) {
  const {
    method = "GET",
    body,
    headers: optHeaders = {},
    expectUnauthorized = false,
    ...rest
  } = options;

  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${API_BASE}${path}`;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && body instanceof Blob;

  const headers = { ...optHeaders };

  const upperMethod = method.toUpperCase();
  const needsCsrf = !["GET", "HEAD", "OPTIONS"].includes(upperMethod);

  if (needsCsrf && !headers["CSRF-Token"] && !headers["X-CSRF-Token"]) {
    headers["CSRF-Token"] = await getCsrfToken();
  }

  const shouldJson =
    body != null && !isFormData && !isBlob && typeof body !== "string";

  if (shouldJson && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const opts = {
    method,
    credentials: "include",
    headers,
    ...rest,
  };

  if (body != null) {
    opts.body = shouldJson ? JSON.stringify(body) : body;
  }

  const res = await fetch(url, opts);

  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const data =
    res.status === 204 ? null : isJson ? await res.json() : await res.text();

  if (res.status === 401 && expectUnauthorized) {
    return isJson ? (data ?? { user: null }) : { user: null };
  }

  if (!res.ok) {
    if (res.status === 403) {
      csrfToken = null;
    }

    const message =
      (isJson && (data?.error || data?.message)) ||
      (typeof data === "string" ? data : null) ||
      `Request failed: ${res.status} ${res.statusText}`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}