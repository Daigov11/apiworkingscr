type ApiResponse<T> = {
  codResponse: string;
  message: string;
  data: T;
};

export type AdminPageListItem = {
  id: number;
  slug: string;
  metaTitle: string;
  status: string;
  updatedAt: string;
};

export type AdminPageDetails = {
  page: {
    id: number;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    ogImage: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  sections: Array<{
    sectionKey: string;
    type: string;
    sortOrder: number;
    dataJson: string;
  }>;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("awcmr_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...authHeaders(),
    },
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  if (json.codResponse !== "1") throw new Error(json.message || "Error API");
  return json.data;
}

/** Login */
export async function loginCMS(usuario: string, password: string) {
  const res = await fetch("/api/admin/loginCMS", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });

  const json = await res.json();
  if (!res.ok || json.codResponse !== "1") throw new Error(json.message || "Login falló");
  return json.data as {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: string;
    token: string;
  };
}

/** Pages list */
export async function adminListPages(args: { search?: string; status?: string; page?: number; pageSize?: number }) {
  const q = new URLSearchParams();
  if (args.search) q.set("search", args.search);
  if (args.status) q.set("status", args.status);
  q.set("page", String(args.page ?? 1));
  q.set("pageSize", String(args.pageSize ?? 20));

  return callApi<{ items: AdminPageListItem[]; total: number }>(`/api/admin/pages?${q.toString()}`, {
    method: "GET",
  });
}

/** Get page by id */
export async function adminGetPage(id: number) {
  return callApi<AdminPageDetails>(`/api/admin/pages/${id}`, { method: "GET" });
}

/** Create */
export async function adminCreatePage(payload: any) {
  return callApi<{ id: number }>(`/api/admin/pages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Update */
export async function adminUpdatePage(id: number, payload: any) {
  return callApi<{ id: number }>(`/api/admin/pages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/** Delete */
export async function adminDeletePage(id: number) {
  return callApi<{ id: number }>(`/api/admin/pages/${id}`, { method: "DELETE" });
}