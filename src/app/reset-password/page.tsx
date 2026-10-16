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
        {/* Card disamakan dengan Login Kader */}
        <div
          className="w-full max-w-[520px] bg-white rounded-[30px] px-6 pt-8 pb-8 sm:pt-[44px] sm:pb-[70px] sm:pl-[80px] sm:pr-[86px] transition-all z-20"
          style={{
            boxShadow: '8px 10px 3.5px #D45060',
          }}
        >
          {/* Header Title SiMPASI */}
          <div className="mb-[36px]">
            <h1 className="text-center text-[25px] font-bold text-[#D45060] leading-[30px]">
              SiMPASI
            </h1>
            <p className="mt-[5px] text-center text-[11.5px] font-medium text-black leading-[14px] max-w-[220px] mx-auto">
              Sistem Informasi Mencegah Stunting<br />
              Silahkan masuk ke akun Anda
            </p>
          </div>

          {/* Section Heading: Buat Password Baru */}
          <div className="text-center mb-[28px]">
            <h2 className="text-[20px] font-bold text-black leading-[24px]">
              Buat Password Baru
            </h2>
            <p className="mt-[6px] text-[11.5px] font-normal text-black leading-[14px]">
              Kode terverifikasi. Buat password baru untuk akun Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Input Password Baru */}
            <div>
              <label className="block text-[20px] font-bold text-[#797777] mb-[6px] leading-[24px]">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[40px] pl-[14px] pr-12 rounded-[5px] border border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[12px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-black hover:text-[#D45060] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="w-[20px] h-[20px]" />
                  ) : (
                    <EyeOff className="w-[20px] h-[20px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Input Konfirmasi Password */}
            <div className="mt-[10px]">
              <label className="block text-[20px] font-bold text-[#797777] mb-[6px] leading-[24px]">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[40px] pl-[14px] pr-12 rounded-[5px] border border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[12px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-black hover:text-[#D45060] transition-colors cursor-pointer"
                >
                  {showConfirm ? (
                    <Eye className="w-[20px] h-[20px]" />
                  ) : (
                    <EyeOff className="w-[20px] h-[20px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Simpan Password Baru */}
            <div className="mt-[27px] flex justify-center sm:justify-start sm:pl-[38px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[270px] h-[50px] bg-[#D45060] hover:bg-[#c44454] disabled:bg-[#D45060]/60 disabled:cursor-not-allowed text-white text-[20px] font-bold rounded-[10px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm cursor-pointer"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>

      {/* ============ TOAST: VERIFIKASI EMAIL BERHASIL ============ */}
      {showToast && (
        // Toast diperkecil
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[24px] right-[24px] z-[9999]"
          style={{ width: '380px', height: '100px' }}
        >
          {/* Background hijau (aksen kiri) */}
          <div
            className="absolute inset-0"
            style={{
              background: '#2E9C52',
              borderRadius: '12px',
            }}
          />

          {/* Panel putih */}
          <div
            className="absolute"
            style={{
              left: '6px',
              top: 0,
              width: '369px',
              height: '100px',
              background: '#FFFFFF',
              borderRadius: '12px',
            }}
          />

          {/* Icon centang */}
          <svg
            className="absolute"
            style={{
              left: '20px',
              top: '18px',
              width: '28px',
              height: '28px',
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
              left: '58px',
              top: '19px',
              fontSize: '14px',
              lineHeight: '17px',
            }}
          >
            Verifikasi email berhasil
          </h3>

          {/* Deskripsi */}
          <p
            className="absolute"
            style={{
              left: '58px',
              top: '40px',
              width: '305px',
              fontSize: '12px',
              lineHeight: '15px',
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