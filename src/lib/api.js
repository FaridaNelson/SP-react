export const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function api(path, options = {}) {
  const {
    method = "GET",
    body,
    headers: optHeaders = {},
    expectUnauthorized = false,
    ...rest
  } = options;

  console.log("API_BASE:", API_BASE);
  const isAbsolute = /^https?:\/\//i.test(path);
  const url = isAbsolute ? path : `${API_BASE}${path}`;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isBlob = typeof Blob !== "undefined" && body instanceof Blob;

  const headers = { ...optHeaders };
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
