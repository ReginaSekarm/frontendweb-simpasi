'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '../../components/AuthLayout';
import PageTransition from '../../components/PageTransition';  

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleKirimKode = () => {
    if (!email || !email.includes('@')) {
      alert('Masukkan email yang valid terlebih dahulu.');
      return;
    }

    console.log('Kirim kode verifikasi ke:', email);
    window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
  };

  return (
    <AuthLayout>
      {/* Ukuran card disamakan dengan Login Kader */}
      <div
        className="w-full max-w-[520px] bg-white rounded-[30px] px-6 pt-8 pb-8 sm:pt-[44px] sm:pb-[70px] sm:pl-[80px] sm:pr-[86px] transition-all z-20"
        style={{
          boxShadow: '8px 10px 3.5px #D45060',
        }}
      >
        {/* Header Title SiMPASI — sama seperti Login Kader */}
        <div className="mb-[36px]">
          <h1 className="text-center text-[25px] font-bold text-[#D45060] leading-[30px]">
            SiMPASI
          </h1>
          <p className="mt-[5px] text-center text-[11.5px] font-medium text-black leading-[14px] max-w-[220px] mx-auto">
            Sistem Informasi Mencegah Stunting<br />
            Silahkan masuk ke akun Anda
          </p>
        </div>

        {/* Section Heading: Lupa Password? */}
        <div className="text-center mb-[28px]">
          <h2 className="text-[20px] font-bold text-black leading-[24px]">
            Lupa Password?
          </h2>
          <p className="mt-[6px] text-[11.5px] font-normal text-black leading-[14px]">
            Masukkan email akun kader Anda, kami kirimkan kode verifikasi.
          </p>
        </div>

        {/* Form */}
        <div>
          {/* Input Email */}
          <div>
            <label className="block text-[20px] font-bold text-[#797777] mb-[6px] leading-[24px]">
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
              className="w-full h-[40px] pl-[10px] pr-4 rounded-[5px] border border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[12px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
            />
          </div>

          {/* Tombol Kirim Kode Verifikasi */}
          <div className="mt-[27px] flex justify-center sm:justify-start sm:pl-[38px]">
            <button
              type="button"
              onClick={handleKirimKode}
              className="w-full max-w-[270px] h-[50px] bg-[#D45060] hover:bg-[#c44454] text-white text-[20px] font-bold rounded-[10px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm cursor-pointer"
            >
              Kirim Kode Verifikasi
            </button>
          </div>

          {/* Kembali ke Login */}
          <div className="mt-[17px] text-center sm:-ml-[36px]">
            <Link
              href="/login"
              className="text-[11px] font-medium text-[#797777] hover:text-[#D45060] transition-colors underline"
            >
              Kembali ke halaman masuk
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}