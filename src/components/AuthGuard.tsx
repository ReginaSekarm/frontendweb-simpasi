'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, decodeToken, clearToken } from '../lib/auth';

type Props = {
  children: React.ReactNode;
  role?: 'user' | 'kader'; // kalau diisi, hanya role ini yang boleh masuk
};

export default function AuthGuard({ children, role }: Props) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const payload = decodeToken(getToken());
    const expired = !payload || payload.exp * 1000 < Date.now();
    const wrongRole = !!payload && !!role && payload.role !== role;

    if (expired || wrongRole) {
      clearToken();
      router.replace('/login');
      return;
    }
    setAllowed(true);
  }, [router, role]);

  // Jangan tampilkan isi halaman sebelum token dicek
  if (!allowed) return null;

  return <>{children}</>;
}