'use client';

import { useState, useMemo, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, Circle, X } from 'lucide-react';

// ================= TYPES =================
type Rule = {
  key: string;
  label: string;
  required: boolean;
  test: (v: string) => boolean;
};

type ToastType = 'success' | 'error';

type ToastState = {
  type: ToastType;
  title: string;
  message: string;
} | null;

const RULES: Rule[] = [
  { key: 'len', label: 'Minimal 8 karakter', required: true, test: (v) => v.length >= 8 },
  { key: 'upper', label: 'Mengandung huruf besar', required: true, test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Mengandung huruf kecil', required: true, test: (v) => /[a-z]/.test(v) },
  { key: 'num', label: 'Mengandung angka', required: true, test: (v) => /\d/.test(v) },
  { key: 'symbol', label: 'Mengandung simbol (disarankan)', required: false, test: (v) => /[^A-Za-z0-9]/.test(v) },
];

// ================= TOAST COMPONENT =================
function Toast({
  type,
  title,
  message,
  onClose,
}: {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
}) {
  const accentColor = type === 'success' ? '#2E9C52' : '#D45060';

  return (
    // 👇 Toast diperkecil
    <div
      className="fixed top-[24px] right-[24px] z-[10000] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{ width: '380px', minHeight: '100px' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '375px',
          height: '100%',
          background: accentColor,
          borderRadius: '12px',
        }}
      />

      <div
        className="absolute flex items-start gap-3 px-4 py-4"
        style={{
          left: '6px',
          top: 0,
          width: '369px',
          minHeight: '100px',
          background: '#FFFFFF',
          borderRadius: '12px',
        }}
      >
        <div
          className="shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center mt-[2px]"
          style={{ background: accentColor }}
        >
          {type === 'success' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12.5L10 17.5L19 7"
                stroke="#FFFFFF"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 6V13" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="12" cy="17.5" r="1.6" fill="#FFFFFF" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          {/* 👇 Font judul dan deskripsi diperkecil */}
          <h3 className="text-black font-bold text-[14px] leading-[17px]">{title}</h3>
          <p className="mt-1 text-black/70 text-[12px] leading-[15px]">{message}</p>
        </div>

        {type === 'error' && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="shrink-0 w-[20px] h-[20px] flex items-center justify-center text-[#8F8F8F] hover:text-black transition-colors cursor-pointer mt-1"
          >
            <X className="w-[16px] h-[16px]" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================
export default function GantiKataSandiTab() {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const ruleStatus = useMemo(
    () => RULES.map((r) => ({ ...r, passed: r.test(newPw) })),
    [newPw]
  );

  const confirmMatch = newPw.length > 0 && newPw === confirmPw;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (type: ToastType, title: string, message: string) => {
    setToast({ type, title, message });
  };

  const handleSubmit = () => {
    if (!oldPw.trim()) {
      showToast('error', 'Gagal Membuat Kata Sandi!', 'Kata sandi lama wajib diisi terlebih dahulu.');
      return;
    }

    const failedRule = ruleStatus.find((r) => r.required && !r.passed);
    if (failedRule) {
      showToast(
        'error',
        'Gagal Membuat Kata Sandi!',
        `Kata sandi belum memenuhi syarat. Kata sandi harus ${failedRule.label.toLowerCase()}.`
      );
      return;
    }

    if (!confirmMatch) {
      showToast(
        'error',
        'Konfirmasi Tidak Cocok',
        'Kata sandi dan konfirmasi kata sandi tidak sama. Periksa kembali kata sandi Anda.'
      );
      return;
    }

    setLoading(true);
    // TODO: hubungkan ke API ganti kata sandi
    setTimeout(() => {
      setLoading(false);
      showToast(
        'success',
        'Kata Sandi Berhasil Dibuat!',
        'Kata sandi baru sudah aktif. Silakan masuk menggunakan kata sandi baru.'
      );
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
    }, 800);
  };

  // 👇 Ukuran input, label, dan tombol mata diperkecil
  const inputCls =
    'w-full h-[38px] pl-3.5 pr-11 rounded-[10px] bg-[#D9D9D9]/50 text-[13px] text-black placeholder-[#8F8F8F] focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelCls = 'block text-[13px] font-bold text-black mb-1.5';
  const eyeBtn =
    'absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8F8F] hover:text-black cursor-pointer';

  return (
    <>
      {/* 👇 Container diperkecil dari 638px menjadi 460px */}
      <div className="bg-white border border-[#AAA6A6]/70 rounded-[14px] w-full max-w-[460px] px-8 pt-6 pb-6">

        {/* Kata Sandi Lama */}
        <div className="mb-3">
          <label className={labelCls}>Kata Sandi Lama</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
            <button type="button" onClick={() => setShowOld(!showOld)} className={eyeBtn} aria-label="Toggle">
              {showOld ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
            </button>
          </div>
        </div>

        {/* Kata Sandi Baru */}
        <div className="mb-3">
          <label className={labelCls}>Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className={eyeBtn} aria-label="Toggle">
              {showNew ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
            </button>
          </div>
        </div>

        {/* Konfirmasi Kata Sandi Baru */}
        <div className="mb-3">
          <label className={labelCls}>Konfirmasi Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="••••••••"
              className={inputCls}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className={eyeBtn} aria-label="Toggle">
              {showConfirm ? <Eye className="w-[16px] h-[16px]" /> : <EyeOff className="w-[16px] h-[16px]" />}
            </button>
          </div>

          {confirmPw.length > 0 && !confirmMatch && (
            <p className="mt-1.5 text-[11px] text-[#D45060] font-semibold">
              Konfirmasi kata sandi tidak cocok
            </p>
          )}
        </div>

        {/* ============ CHECKLIST REALTIME ============ */}
        {/* 👇 Ukuran icon dan font diperkecil */}
        <ul className="space-y-1.5 mt-3 mb-6">
          {ruleStatus.map((r) => (
            <li key={r.key} className="flex items-center gap-2">
              {r.passed ? (
                <CheckCircle2 className="w-[14px] h-[14px] text-[#2E9C52] shrink-0" strokeWidth={2.2} />
              ) : (
                <Circle className="w-[14px] h-[14px] text-[#797777] shrink-0" strokeWidth={2} />
              )}
              <span className={`text-[12px] font-medium ${r.passed ? 'text-[#2E9C52]' : 'text-[#797777]'}`}>
                {r.label}
              </span>
            </li>
          ))}
        </ul>

        {/* ============ TOMBOL ============ */}
        <div className="flex justify-center">
          {/* 👇 Tombol diperkecil */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`h-[38px] px-6 rounded-[10px] text-[13px] font-bold transition-all text-white ${
              loading
                ? 'bg-[#D45060]/60 cursor-not-allowed'
                : 'bg-[#D45060] hover:bg-[#c44454] cursor-pointer active:scale-[0.98]'
            }`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
          </button>
        </div>
      </div>

      {/* ============ TOAST ============ */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}