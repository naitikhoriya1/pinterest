const BASE = import.meta.env.VITE_API_URL as string;

const TOKEN_KEY = "pinterest_api_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const setToken = (t: string) => {
  console.log("%c[Auth Token]%c Saved backend JWT to localStorage", "color: #10b981; font-weight: bold;", "color: inherit;");
  localStorage.setItem(TOKEN_KEY, t);
};
export const clearToken = () => {
  console.log("%c[Auth Token]%c Cleared backend JWT from localStorage", "color: #ef4444; font-weight: bold;", "color: inherit;");
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method || "GET";
  const token = getToken();
  const url = `${BASE}${path}`;

  console.log(
    `%c[API Request]%c ${method} ${path}`,
    "color: #3b82f6; font-weight: bold;",
    "color: inherit;",
    {
      url,
      hasToken: Boolean(token),
      headers: options.headers,
    }
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const startTime = performance.now();
  let res: Response;

  try {
    res = await fetch(url, { ...options, headers });
  } catch (netErr: any) {
    console.error(
      `%c[API Network Failure]%c ${method} ${path}`,
      "color: #ef4444; font-weight: bold;",
      "color: inherit;",
      { error: netErr?.message || netErr, url }
    );
    throw new Error(`Network failure: ${netErr?.message || "Failed to fetch"}`);
  }

  const duration = Math.round(performance.now() - startTime);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error(
      `%c[API Error ${res.status}]%c ${method} ${path} (${duration}ms)`,
      "color: #ef4444; font-weight: bold;",
      "color: inherit;",
      {
        status: res.status,
        statusText: res.statusText,
        responseBody: body,
        url,
      }
    );
    throw new Error(body?.message ?? `API error ${res.status}`);
  }

  const data = (await res.json()) as T;
  console.log(
    `%c[API Success ${res.status}]%c ${method} ${path} (${duration}ms)`,
    "color: #10b981; font-weight: bold;",
    "color: inherit;",
    { data }
  );

  return data;
}

/**
 * Uploads multipart form data (e.g. image files from disk) with Bearer token.
 */
export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const token = getToken();
  const url = `${BASE}${path}`;

  console.log(
    `%c[API Upload Request]%c POST ${path}`,
    "color: #f59e0b; font-weight: bold;",
    "color: inherit;",
    {
      url,
      hasToken: Boolean(token),
      formDataEntries: Array.from((formData as any).entries?.() || []),
    }
  );

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const startTime = performance.now();
  let res: Response;

  try {
    res = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });
  } catch (netErr: any) {
    console.error(
      `%c[API Upload Network Failure]%c POST ${path}`,
      "color: #ef4444; font-weight: bold;",
      "color: inherit;",
      { error: netErr?.message || netErr, url }
    );
    throw new Error(`Upload network error: ${netErr?.message || "Failed to upload"}`);
  }

  const duration = Math.round(performance.now() - startTime);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    console.error(
      `%c[API Upload Error ${res.status}]%c POST ${path} (${duration}ms)`,
      "color: #ef4444; font-weight: bold;",
      "color: inherit;",
      {
        status: res.status,
        responseBody: body,
        url,
      }
    );
    throw new Error(body?.message ?? `API error ${res.status}`);
  }

  const data = (await res.json()) as T;
  console.log(
    `%c[API Upload Success ${res.status}]%c POST ${path} (${duration}ms)`,
    "color: #10b981; font-weight: bold;",
    "color: inherit;",
    { data }
  );

  return data;
}

export const apiFetch = request;

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) => apiUpload<T>(path, formData),
};
