'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '../../components/AuthLayout';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'nama@gmail.com';

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus input pertama saat halaman load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 4) {
      alert('Masukkan 4 digit kode verifikasi terlebih dahulu.');
      return;
    }
    setIsLoading(true);
    // TODO: panggil API verifikasi OTP di sini
    setTimeout(() => {
      setIsLoading(false);
      console.log('Verifikasi OTP:', code, 'untuk email:', email);
      // Arahkan ke halaman reset password setelah sukses
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    }, 800);
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(60);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    // TODO: panggil API kirim ulang kode di sini
    console.log('Kirim ulang kode ke:', email);

    // Tampilkan toast & auto-dismiss
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <>
      <AuthLayout>
        {/* SISI KANAN: FORM CARD VERIFIKASI OTP */}
        <div
          className="w-full max-w-[641px] bg-white rounded-[38px] px-8 py-10 sm:px-12 sm:py-14 lg:px-[80px] lg:py-[70px] transition-all z-20"
          style={{
            boxShadow: '10.5px 12.6px 4.3px #D45060',
          }}
        >
          {/* Header Title */}
          <div className="mb-[40px]">
            <h1 className="text-center text-[30.9px] font-bold text-[#D45060] leading-[37px]">
              SiMPASI
            </h1>
            <p className="mt-[9px] text-center text-[13.6px] font-medium text-black leading-[16px]">
              Sistem Informasi Mencegah Stunting<br />
              Silahkan masuk ke akun Anda
            </p>
          </div>

          {/* Form Verifikasi */}
          <form onSubmit={handleVerify}>
            {/* Judul */}
            <h2 className="text-center text-[26px] font-bold text-black leading-tight mb-2">
              Verifikasi Kode
            </h2>
            <p className="text-center text-[13.6px] text-black leading-snug mb-8">
              Masukkan 4 digit kode yang dikirim ke{' '}
              <span className="font-semibold">{email}</span>
            </p>

            {/* Input OTP 4 Kotak */}
            <div className="flex justify-center gap-3 sm:gap-4 mb-6">
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
                  className="w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] text-center text-[26px] font-bold rounded-[12px] border-[1.5px] border-[#DDDDDD] bg-white text-gray-800 focus:outline-none focus:border-[#D45060] focus:ring-2 focus:ring-[#D45060]/30 transition-all"
                />
              ))}
            </div>

            {/* Timer */}
            <p className="text-center text-[13.6px] text-black mb-1">
              Kode berlaku dalam{' '}
              <span className="text-[#D45060] font-bold">
                {formatTime(timeLeft)}
              </span>
            </p>

            {/* Resend */}
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={handleResend}
                disabled={timeLeft > 0}
                className={`text-[13.6px] transition-colors ${
                  timeLeft > 0
                    ? 'text-[#797777] cursor-not-allowed'
                    : 'text-[#D45060] font-bold hover:underline cursor-pointer'
                }`}
              >
                Kirim Ulang Kode
              </button>
            </div>

            {/* Tombol Verifikasi */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full max-w-[333.73px] h-[61.8px] bg-[#D45060] hover:bg-[#c44454] disabled:bg-[#D45060]/60 disabled:cursor-not-allowed text-white text-[24.7px] font-bold rounded-[12.36px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm"
              >
                {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>

      {/* ============ TOAST: KODE OTP BERHASIL DIKIRIM ULANG (KANAN ATAS, AUTO-DISMISS) ============ */}
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
            Kode OTP berhasil dikirim ulang
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