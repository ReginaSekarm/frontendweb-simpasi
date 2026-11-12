import { getToken, clearToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type Body = Record<string, unknown> | unknown[];

export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data: T;
  unreadCount?: number;
};

type QueryValue = string | number | boolean | null | undefined;

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: Body | FormData | string | null;
  query?: Record<string, QueryValue>;
  auth?: boolean; // false = jangan kirim token (login, lupa password)
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function api<T = any>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, query, headers, auth = true, ...rest } = options;

  // Susun query string, abaikan nilai kosong
  let url = `${API_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    const qs = params.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }

  const token = auth ? getToken() : null;
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;

  const res = await fetch(url, {
    ...rest,
    headers: {
      // FormData: biarkan browser mengatur Content-Type (multipart boundary)
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    },
    body:
      body == null
        ? undefined
        : isForm || typeof body === 'string'
        ? (body as BodyInit)
        : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Token habis/tidak valid -> kembali ke login (hanya untuk request yang memakai token)
    if (auth && (res.status === 401 || res.status === 403)) {
      clearToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    throw new ApiError(res.status, data.message || 'Terjadi kesalahan');
  }

  // Mengembalikan seluruh objek respons agar kompatibel dengan pemanggilan `.data` maupun langsung
  return data as T;
}