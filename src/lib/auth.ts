const TOKEN_KEY = 'simpasi_token';

export type TokenPayload = { id: number; role: 'user' | 'kader'; exp: number };

// "Ingat saya" dicentang -> localStorage, tidak -> sessionStorage (hilang saat tab ditutup)
export const saveToken = (token: string, remember: boolean): void => {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Ambil dari localStorage atau sessionStorage
  const token = localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  // Bersihkan jika ada spasi berlebih atau prefix "Bearer " yang tidak sengaja tersimpan
  return token.replace(/^Bearer\s+/i, '').trim();
};

export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
};

// Response login hanya berisi token, jadi role dibaca dari isi token
export const decodeToken = (token: string | null): TokenPayload | null => {
  if (!token) return null;
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const part = cleanToken.split('.')[1];
    if (!part) return null;
    const json = decodeURIComponent(
      atob(part.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json) as TokenPayload;
  } catch {
    return null;
  }
};