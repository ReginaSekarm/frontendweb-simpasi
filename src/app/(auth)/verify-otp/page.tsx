'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '../../../components/AuthLayout';
import { api } from '../../../lib/api';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const storedEmail =
    typeof window !== 'undefined' ? sessionStorage.getItem('reset_email') || '' : '';
  const email = (searchParams.get('email') || storedEmail).trim();
  const purpose = searchParams.get('purpose') === 'register' ? 'register' : 'reset_password';

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (value && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < 3) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const newOtp = ['', '', '', ''];
    pasted.split('').forEach((d, i) => (newOtp[i] = d));
    setOtp(newOtp);
    const nextIdx = Math.min(pasted.length, 3);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Matikan toast (jika sedang muncul) saat verifikasi ditekan
    setShowToast(false);

    const code = otp.join('');
    if (code.length !== 4) {
      setErrorMessage('Masukkan 4 digit kode verifikasi terlebih dahulu.');
      return;
    }

    if (!email) {
      setErrorMessage('Email tidak ditemukan. Ulangi proses dari awal.');
      return;
    }

    setIsLoading(true);
    try {
      if (purpose === 'register') {
        await api('/auth/verify-otp', {
          method: 'POST',
          auth: false,
          body: { email, otpCode: code },
        });
        
        // Langsung pindah halaman tanpa popup
        setTimeout(() => {
          router.push('/login');
        }, 1500);

      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('reset_email', email);
          sessionStorage.setItem('reset_otp_code', code);
        }
        
        // Langsung pindah halaman tanpa popup
        setTimeout(() => {
          router.push(
            `/reset-password?email=${encodeURIComponent(email)}&otpCode=${encodeURIComponent(code)}`
          );
        }, 1500);
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Kode OTP salah atau sudah kedaluwarsa.');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || !email) return;
    setErrorMessage('');

    try {
      const res = await api<any>('/auth/resend-otp', {
        method: 'POST',
        auth: false,
        body: { email, purpose },
      });

      setTimeLeft(res?.retryAfterSeconds || 60);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();

      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error: any) {
      if (error?.retryAfterSeconds) {
        setTimeLeft(error.retryAfterSeconds);
      }
      setErrorMessage(error?.message || 'Gagal mengirim ulang kode OTP.');
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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

          {/* Form Verifikasi */}
          <form onSubmit={handleVerify}>
            {/* Judul */}
            <h2 className="text-center text-[20px] font-bold text-black leading-[24px] mb-1.5">
              Verifikasi Kode
            </h2>
            <p className="text-center text-[11.5px] text-black leading-[14px] mb-5">
              Masukkan 4 digit kode yang dikirim ke{' '}
              <span className="font-semibold">{email || 'nama@gmail.com'}</span>
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-[12px] rounded-md text-center">
                {errorMessage}
              </div>
            )}

            {/* Input OTP 4 Kotak */}
            <div className="flex justify-center gap-2 sm:gap-2.5 mb-5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="w-[48px] h-[48px] sm:w-[54px] sm:h-[54px] text-center text-[18px] font-bold rounded-[8px] border-[1.5px] border-[#DDDDDD] bg-white text-gray-800 focus:outline-none focus:border-[#D45060] focus:ring-2 focus:ring-[#D45060]/30 transition-all"
                />
              ))}
            </div>

            {/* Timer */}
            <p className="text-center text-[11.5px] text-black mb-1">
              Kode berlaku dalam{' '}
              <span className="text-[#D45060] font-bold">
                {formatTime(timeLeft)}
              </span>
            </p>

            {/* Resend */}
            <div className="text-center mb-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-[11.5px] transition-colors ${
                  timeLeft > 0
                    ? 'text-[#797777] cursor-not-allowed'
                    : 'text-[#D45060] font-bold hover:underline cursor-pointer'
                }`}
              >
                Kirim Ulang Kode
              </button>
            </div>

            {/* Tombol Verifikasi */}
            <div className="flex justify-center sm:justify-start sm:pl-[38px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[270px] h-[50px] bg-[#D45060] hover:bg-[#c44454] disabled:bg-[#D45060]/60 disabled:cursor-not-allowed text-white text-[20px] font-bold rounded-[10px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm cursor-pointer"
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>

      {/* ============ TOAST: KIRIM ULANG ============ */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-[24px] right-[24px] z-[9999] animate-in slide-in-from-top-4 fade-in duration-300"
          style={{ width: '380px', height: '100px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: '#2E9C52',
              borderRadius: '12px',
            }}
          />

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
            Kode OTP berhasil dikirim ulang
          </h3>

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
            Kode verifikasi baru sudah dikirim ke email Anda.
          </p>
        </div>
      )}
    </>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-[#B3EAE8]" />}>
      <VerifyOTPContent />
    </Suspense>
  );
}