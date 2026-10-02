'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Tampilkan toast "Verifikasi email berhasil" saat halaman dibuka
  useEffect(() => {
    setShowToast(true);
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      alert('Password minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    // TODO: Hubungkan ke endpoint API reset password
    console.log('Reset password untuk:', email, '→ password baru:', password);

    setTimeout(() => {
      setIsLoading(false);
      alert('Password berhasil diperbarui. Silakan login kembali.');
      router.push('/login');
    }, 800);
  };

  return (
    <>
      <AuthLayout>
        {/* SISI KANAN: FORM CARD */}
        <div
          className="w-full max-w-[641px] bg-white rounded-[38px] px-8 py-10 sm:px-12 sm:py-14 lg:px-[80px] lg:py-[70px] transition-all z-20"
          style={{
            boxShadow: '10.5px 12.6px 4.3px #D45060',
          }}
        >
          {/* Header Title SiMPASI */}
          <div className="mb-[26px]">
            <h1 className="text-center text-[30.9px] font-bold text-[#D45060] leading-[37px]">
              SiMPASI
            </h1>
            <p className="mt-[6px] text-center text-[13.6px] font-medium text-black leading-[16px] max-w-[240px] mx-auto">
              Sistem Informasi Mencegah Stunting<br />
              Silahkan masuk ke akun Anda
            </p>
          </div>

          {/* Section Heading: Buat Password Baru */}
          <div className="text-center mb-[28px]">
            <h2 className="text-[25.7px] font-bold text-black leading-[31px]">
              Buat Password Baru
            </h2>
            <p className="mt-[8px] text-[13.6px] font-normal text-black leading-[18px]">
              Kode terverifikasi. Buat password baru untuk akun Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Input Password Baru */}
            <div>
              <label className="block text-[20px] font-bold text-[#797777] mb-2 leading-[26px]">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[51.4px] pl-[18.5px] pr-14 rounded-[6.4px] border-[1.28px] border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[15px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[18.6px] top-1/2 -translate-y-1/2 text-black hover:text-[#D45060] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="w-[24px] h-[24px]" />
                  ) : (
                    <EyeOff className="w-[24px] h-[24px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password */}
            <div className="mt-[18px]">
              <label className="block text-[20px] font-bold text-[#797777] mb-2 leading-[26px]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[51.4px] pl-[18.5px] pr-14 rounded-[6.4px] border-[1.28px] border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[15px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-[18.6px] top-1/2 -translate-y-1/2 text-black hover:text-[#D45060] transition-colors cursor-pointer"
                >
                  {showConfirm ? (
                    <Eye className="w-[24px] h-[24px]" />
                  ) : (
                    <EyeOff className="w-[24px] h-[24px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Simpan Password Baru */}
            <div className="mt-[34px] flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[347px] h-[64px] bg-[#D45060] hover:bg-[#c44454] disabled:bg-[#D45060]/60 disabled:cursor-not-allowed text-white text-[22px] sm:text-[24px] font-bold rounded-[12.8px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm cursor-pointer"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>

      {/* ============ TOAST: VERIFIKASI EMAIL BERHASIL (KANAN ATAS, AUTO-DISMISS) ============ */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-[9999]"
          style={{ width: '549.63px', height: '146.14px' }}
        >
          {/* Rectangle 410 — background hijau */}
          <div
            className="absolute inset-0"
            style={{
              background: '#2E9C52',
              borderRadius: '19.0623px',
            }}
          />

          {/* Rectangle 411 — panel putih */}
          <div
            className="absolute"
            style={{
              left: '9.53px',
              top: 0,
              width: '534.38px',
              height: '146.14px',
              background: '#FFFFFF',
              borderRadius: '19.0623px',
            }}
          />

          {/* healthicons:yes — ikon centang */}
          <svg
            className="absolute"
            style={{
              left: '29.23px',
              top: '26.69px',
              width: '44.48px',
              height: '44.48px',
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="12" fill="#2E9C52" />
            <path
              d="M6.8 12.5L10.4 16.1L17.2 9.3"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          {/* Judul */}
          <h3
            className="absolute font-bold text-black"
            style={{
              left: '85.78px',
              top: '27.96px',
              fontSize: '20.3331px',
              lineHeight: '25px',
            }}
          >
            Verifikasi email berhasil
          </h3>

          {/* Deskripsi */}
          <p
            className="absolute"
            style={{
              left: '86px',
              top: '67px',
              width: '413px',
              fontSize: '20px',
              lineHeight: '24px',
              color: '#8F8F8F',
            }}
          >
            Data email telah terkonfirmasi.
          </p>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#B3EAE8]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}