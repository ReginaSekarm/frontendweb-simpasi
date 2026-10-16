'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, X } from 'lucide-react';
import AuthLayout from '../../components/AuthLayout';
import PageTransition from '../../components/PageTransition';  
import {SYARAT_KETENTUAN, KEBIJAKAN_PRIVASI, KEBIJAKAN_PRIVASI_INTRO,} from '../login/syarat-kebijakan';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreeInModal, setAgreeInModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!agreeTerms) {
    alert('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
    return;
  }
  console.log({ email, password, rememberMe });
  // Redirect ke pengaturan untuk lengkapi profil dulu
  router.push('/pengaturan?lengkapi=1');
};

  const openTermsModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTermsModal(true);
  };

  return (
    <>
      <AuthLayout>
        {/* ============ FORM CARD ============ */}
        <div
          className="w-full max-w-[520px] bg-white rounded-[30px] px-6 pt-8 pb-8 sm:pt-[44px] sm:pb-[70px] sm:pl-[80px] sm:pr-[86px] transition-all z-20"
          style={{ boxShadow: '8px 10px 3.5px #D45060' }}
        >
          {/* Header */}
          <div className="mb-[36px]">
            <h1 className="text-center text-[25px] font-bold text-[#D45060] leading-[30px]">
              SiMPASI
            </h1>
            <p className="mt-[5px] text-center text-[11.5px] font-medium text-black leading-[14px] max-w-[220px] mx-auto">
              Sistem Informasi Mencegah Stunting<br />
              Silahkan masuk ke akun Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-[20px] font-bold text-[#797777] mb-[6px] leading-[24px]">
                Email
              </label>
              
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full h-[40px] pl-[10px] pr-4 rounded-[5px] border border-[#AAA6A6]/50 bg-white text-gray-800 placeholder-[#AAA6A6] text-[12px] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
              />
            </div>

            <div className="mt-[10px]">
              <label className="block text-[20px] font-bold text-[#797777] mb-[6px] leading-[24px]">
                Password
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
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-black hover:text-[#D45060] transition-colors"
                >
                  {showPassword ? <Eye className="w-[20px] h-[20px]" /> : <EyeOff className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>

            <div className="mt-[17px] flex items-center justify-between ml-[5px] sm:-mr-[4px]">
              <label className="flex items-center gap-[7px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[14px] h-[14px] rounded-[4px] border-[1.4px] border-[#797777] bg-[#F7F8F0] accent-[#D45060] cursor-pointer"
                />
                <span className="text-[11px] leading-[13px] text-[#797777]">Ingat saya</span>
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-[13px] leading-[15px] font-bold text-[#797777] hover:text-[#D45060] transition-colors cursor-pointer"
              >
                Lupa Password?
              </button>
            </div>

            <div className="mt-[22px] ml-[12px]">
              <label className="flex items-start gap-[5px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-[14px] h-[14px] rounded-[4px] border-[1.4px] border-[#797777] bg-[#F7F8F0] accent-[#D45060] cursor-pointer shrink-0"
                />
                <span className="mt-px text-[9.5px] text-black leading-[12px]">
                  Saya menyetujui{' '}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={openTermsModal}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') openTermsModal(e);
                    }}
                    className="text-[#D45060] font-bold hover:underline cursor-pointer underline-offset-2"
                  >
                    Syarat & Ketentuan
                  </span>{' '}
                  serta{' '}
                  <span className="text-[#D45060] font-bold hover:underline">
                    Kebijakan Privasi
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-[27px] flex justify-center sm:justify-start sm:pl-[38px]">
              <button
                type="submit"
                className="w-full max-w-[270px] h-[50px] bg-[#D45060] hover:bg-[#c44454] text-white text-[20px] font-bold rounded-[10px] transition-all active:scale-[0.98] flex items-center justify-center shadow-sm"
              >
                Masuk
              </button>
            </div>
          </form>
        </div>
      </AuthLayout>

      {/* ============ MODAL SYARAT & KETENTUAN + KEBIJAKAN PRIVASI ============ */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="relative w-full max-w-[519px] max-h-[90vh] flex flex-col bg-white rounded-[24px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#D45060] px-6 pt-6 pb-5">
              <h2 className="text-white text-[22px] font-bold leading-tight pr-10">
                Syarat &amp; Ketentuan
              </h2>
              <p className="text-white/80 text-[14px] mt-1">
                Mohon baca dengan seksama sebelum melanjutkan
              </p>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                aria-label="Tutup"
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-[13.5px] text-[#5a5a5a] leading-snug">
              {/* ====== BAGIAN 1: SYARAT & KETENTUAN ====== */}
              {SYARAT_KETENTUAN.map((s, i) => (
                <div key={`sk-${i}`}>
                  <h3 className="font-bold text-black text-[15px] mb-1">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}

              {/* ====== BAGIAN 2: KEBIJAKAN PRIVASI ====== */}
              <div className="pt-4 mt-2 border-t border-gray-200">
                <h2 className="font-bold text-black text-[17px] mb-2">
                  Kebijakan Privasi
                </h2>
                <p className="mb-4 text-[13px] text-[#5a5a5a]">
                  {KEBIJAKAN_PRIVASI_INTRO}
                </p>

                <div className="space-y-4">
                  {KEBIJAKAN_PRIVASI.map((s, i) => (
                    <div key={`kp-${i}`}>
                      <h3 className="font-bold text-black text-[15px] mb-1">{s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}