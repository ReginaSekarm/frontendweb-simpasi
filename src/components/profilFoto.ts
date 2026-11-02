'use client';

import { useEffect, useState } from 'react';

const KEY = 'kader_foto_profil';
const EVENT = 'kader-foto-profil-change';

// Ambil foto profil yang tersimpan ('' kalau belum ada)
export function getProfilFoto(): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}

// Simpan foto profil ('' untuk menghapus) lalu kabari semua komponen
export function setProfilFoto(src: string) {
  try {
    if (src) localStorage.setItem(KEY, src);
    else localStorage.removeItem(KEY);
  } catch {
    // abaikan jika storage penuh / diblokir
  }
  window.dispatchEvent(new Event(EVENT));
}

// Ubah File jadi data URL supaya tetap ada setelah refresh / pindah halaman
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Hook: foto profil selalu sinkron di semua halaman
export function useProfilFoto(): string {
  const [foto, setFoto] = useState('');

  useEffect(() => {
    const sync = () => setFoto(getProfilFoto());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return foto;
}