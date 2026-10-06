export const KEY_BALITA = 'simpasi_balita';
export const KEY_RIWAYAT = 'simpasi_riwayat';
export const KEY_AKTIVITAS = 'simpasi_aktivitas';

export type Aktivitas = {
  id: number;
  timestamp: number;
  type: 'balita' | 'resep' | 'pemeriksaan';
  description: string;
  status: string;
};

export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(key); // ✅ localStorage → sessionStorage
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(key, JSON.stringify(value)); // ✅ localStorage → sessionStorage
}

export function loadAktivitas(): Aktivitas[] {
  return loadJSON<Aktivitas[]>(KEY_AKTIVITAS, []);
}

export function addAktivitas(entry: Omit<Aktivitas, 'id' | 'timestamp'>): void {
  const list = loadAktivitas();
  const newEntry: Aktivitas = {
    ...entry,
    id: Date.now() + Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
  };
  saveJSON(KEY_AKTIVITAS, [newEntry, ...list].slice(0, 50));
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const menit = Math.floor(diff / 60000);
  if (menit < 1) return 'Baru saja';
  if (menit < 60) return `${menit} menit lalu`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam lalu`;
  const hari = Math.floor(jam / 24);
  return `${hari} hari lalu`;
}