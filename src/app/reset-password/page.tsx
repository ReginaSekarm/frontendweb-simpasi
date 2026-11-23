'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import { api } from '../../lib/api';

// Aturan sama dengan backend: min 8 karakter, 1 huruf besar, 1 angka
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_MESSAGE = 'Password minimal 8 karakter, mengandung 1 huruf besar dan 1 angka.';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State untuk Popup Sukses
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const queryEmail = searchParams.get('email') || '';
    const queryOtp =
      searchParams.get('otpCode') ||
      searchParams.get('otp') ||
      searchParams.get('code') ||
      searchParams.get('token') ||
      '';

    const storedEmail =
      typeof window !== 'undefined' ? sessionStorage.getItem('reset_email') || '' : '';
    const storedOtp =
      typeof window !== 'undefined' ? sessionStorage.getItem('reset_otp_code') || '' : '';

    setEmail((queryEmail || storedEmail).trim());
    setOtpCode((queryOtp || storedOtp).trim());
  }, [searchParams]);

  useEffect(() => {
    setShowToast(true);
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !otpCode) {
      setErrorMessage('Data verifikasi tidak lengkap. Ulangi proses lupa password dari awal.');
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(PASSWORD_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      await api('/auth/reset-password', {
        method: 'POST',
        auth: false,
        body: {
          email,
          otpCode,
          newPassword: password,
          confirmPassword,
        },
      });

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('reset_email');
        sessionStorage.removeItem('reset_otp_code');
      }

      setShowSuccessDialog(true);

      redirectTimerRef.current = setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Gagal memperbarui password. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
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

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-[13px] rounded-lg text-center">
              {errorMessage}
            </div>
          )}

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
              <p className="mt-[4px] text-[10.5px] text-[#797777] leading-[13px]">
                Minimal 8 karakter, mengandung 1 huruf besar dan 1 angka.
              </p>
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
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[24px] right-[16px] sm:right-[24px] z-[9999] w-[calc(100vw-32px)] max-w-[380px] h-[100px] animate-in slide-in-from-top-4 fade-in duration-300"
        >
          <div
            className="absolute inset-0"
            style={{
              background: '#2E9C52',
              borderRadius: '12px',
            }}
          />

          <div
            className="absolute top-0 bottom-0 right-0 bg-white"
            style={{
              left: '6px',
              borderRadius: '12px',
            }}
          />

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

          <p
            className="absolute pr-4"
            style={{
              left: '58px',
              top: '40px',
              fontSize: '12px',
              lineHeight: '15px',
              color: '#8F8F8F',
            }}
          >
            Data email telah terkonfirmasi.
          </p>
        </div>
      )}

      {/* ============ POPUP SUKSES PASSWORD BARU (MUNCUL DARI ATAS KANAN) ============ */}
      {showSuccessDialog && (
        <div className="fixed top-[24px] right-[16px] sm:right-[24px] z-[10000] w-[calc(100vw-32px)] max-w-[543px] animate-in slide-in-from-top-4 fade-in duration-300">
          <div
            className="relative flex items-center bg-[#2E9C52] rounded-[19px] shadow-2xl overflow-hidden"
            style={{ minHeight: '100px' }}
          >
            {/* Inner white background yang memberikan efek border hijau di kiri */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-white rounded-[19px]"
              style={{ left: '9.53px', width: 'calc(100% - 9.53px)' }}
            />

            {/* Content */}
            <div className="relative z-10 flex items-center w-full px-5 sm:px-[24px] py-4">
              {/* Icon Centang Hijau */}
              <div className="shrink-0 mr-3 sm:mr-[12px]">
                <CheckCircle2
                  className="w-[38px] h-[38px] sm:w-[44px] sm:h-[44px]"
                  fill="#2E9C52"
                  color="#FFFFFF"
                  strokeWidth={2}
                />
              </div>

              {/* Texts */}
              <div className="flex flex-col">
                <h3 className="text-black font-bold text-[16px] sm:text-[18px] leading-[22px] mb-1">
                  Password berhasil diperbarui
                </h3>
                <p className="text-[#8F8F8F] font-normal text-[13px] sm:text-[14px] leading-[18px]">
                  Silakan login kembali dengan password baru Anda.
                </p>
              </div>
            </div>
          </div>
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