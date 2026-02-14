const API_BASE = "https://lustosasports-api.sportslustosa.workers.dev";

// ── Auth helper ──────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem("ADMIN_TOKEN");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`[${res.status}] ${text}`);
  }
  return res.json() as Promise<T>;
}

// ── Upload ───────────────────────────────────────────────────
export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    headers: authHeaders(),
    body,
  });

  return handleResponse<UploadResult>(res);
}

// ── Products – Read ──────────────────────────────────────────
export interface ProductItem {
  id: string;
  nome: string;
  preco: number;
  image_url: string;
  categoria: string;
  variacoes: string | null;
  descricao: string | null;
  extra_images: string[] | null;
  created_at: string | null;
}

export interface FetchProductsParams {
  category?: string | null;
  size?: string | null;
  search?: string | null;
}

export interface FetchProductsResult {
  items: ProductItem[];
}

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<FetchProductsResult> {
  const url = new URL(`${API_BASE}/api/products`);

  if (params.category) url.searchParams.set("category", params.category);
  if (params.size) url.searchParams.set("size", params.size);
  if (params.search) url.searchParams.set("search", params.search);

  const res = await fetch(url.toString());
  return handleResponse<FetchProductsResult>(res);
}

// ── Products – Create ────────────────────────────────────────
export interface CreateProductPayload {
  nome: string;
  preco: number;
  image_url: string;
  categoria: string;
  variacoes?: string | null;
  descricao?: string | null;
  extra_images?: string[] | null;
}

export async function createProduct(
  payload: CreateProductPayload
): Promise<ProductItem> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  return handleResponse<ProductItem>(res);
}

// ── Products – Update ────────────────────────────────────────
export async function updateProduct(
  id: string,
  payload: Partial<CreateProductPayload>
): Promise<ProductItem> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  return handleResponse<ProductItem>(res);
}

// ── Products – Delete ────────────────────────────────────────
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`[${res.status}] ${text}`);
  }
}
