'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  // Fungsi kirim kode — dipanggil dari onClick tombol & Enter di input
  const handleKirimKode = () => {
    if (!email || !email.includes('@')) {
      alert('Masukkan email yang valid terlebih dahulu.');
      return;
    }

    // TODO: Hubungkan ke endpoint API kirim kode verifikasi
    console.log('Kirim kode verifikasi ke:', email);

    // Paksa pindah halaman pakai window.location — cara paling reliable
    window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
  };

  return (
    <AuthLayout>
      {/* SISI KANAN: FORM CARD (Rectangle 241) */}
      <div
        className="w-full max-w-[641px] bg-white rounded-[38px] px-8 pt-10 pb-12 sm:pt-[52px] sm:pb-[70px] sm:pl-[104px] sm:pr-[113px] transition-all z-20"
        style={{
          boxShadow: '10.5px 12.6px 4.3px #D45060',
        }}
      >
        {/* Header Title SiMPASI */}
        <div className="mb-[24px]">
          <h1 className="text-center text-[30.9px] font-bold text-[#D45060] leading-[37px]">
            SiMPASI
          </h1>
          <p className="mt-[6px] text-center text-[13.6px] font-medium text-black leading-[16px] max-w-[240px] mx-auto">
            Sistem Informasi Mencegah Stunting<br />
            Silahkan masuk ke akun Anda
          </p>
        </div>

        {/* Section Heading: Lupa Password? */}
        <div className="text-center mb-[28px]">
          <h2 className="text-[25.7px] font-bold text-black leading-[31px]">
            Lupa Password?
          </h2>
          <p className="mt-[8px] text-[14px] font-normal text-black leading-[18px]">
            Masukkan email akun kader Anda, kami kirimkan kode verifikasi.
          </p>
        </div>

        {/* Form */}
        <div>
          {/* Input Email */}
          <div>
            <label className="block text-[24.7px] font-bold text-[#797777] mb-2 leading-[30px]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleKirimKode();
              }}
              placeholder="nama@gmail.com"
              className="w-full h-[51.4px] pl-[10px] pr-4 rounded-[6.4px] border-[1.28px] border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[15px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
            />
          </div>

          {/* Tombol Kirim Kode Verifikasi */}
          <div className="mt-[36px] flex justify-center">
            <button
              type="button"
              onClick={handleKirimKode}
              className="w-full max-w-[347px] h-[64px] bg-[#D45060] hover:bg-[#c44454] text-white text-[22px] sm:text-[24px] font-bold rounded-[12.8px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm cursor-pointer"
            >
              Kirim Kode Verifikasi
            </button>
          </div>

          {/* Kembali ke Login */}
          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-[14px] font-medium text-[#797777] hover:text-[#D45060] transition-colors underline"
            >
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}