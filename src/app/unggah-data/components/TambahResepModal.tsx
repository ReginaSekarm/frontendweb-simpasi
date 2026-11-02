'use client';

import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import type { TambahResepForm } from '../types';
import { USIA_RESEP_OPTIONS, USIA_RESEP_LABELS } from '../data';

type Props = {
  data: TambahResepForm;
  errors: Record<string, boolean>;
  onChange: (field: keyof TambahResepForm, value: string | File | null) => void;
  onClose: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
};

// ================= KONFIRMASI BATAL =================
function KonfirmasiBatalModal({
  onTetap,
  onBatalkan,
}: {
  onTetap: () => void;
  onBatalkan: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onTetap}
    >
      <div
        className="relative w-full max-w-[480px] bg-white rounded-[14px] sm:rounded-[16px] shadow-2xl px-5 sm:px-8 pt-7 sm:pt-9 pb-6 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul */}
        <h2 className="text-center text-black font-bold text-[18px] sm:text-[22px] leading-[1.25] sm:leading-[1.2]">
          Batalkan Resep Ini?
        </h2>

        {/* Deskripsi */}
        <p className="mt-3 sm:mt-4 text-center text-black text-[13px] sm:text-[15px] leading-[1.5] font-normal max-w-[420px] mx-auto">
          Data yang sudah diisi belum tersimpan dan akan hilang. Yakin ingin membatalkan?
        </p>

        {/* Tombol */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onTetap}
            className="w-full sm:flex-1 h-[44px] sm:h-[46px] bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[10px] text-[#797777]/90 font-semibold text-[14px] sm:text-[15px] transition-all duration-150 cursor-pointer"
          >
            Tetap di sini
          </button>
          <button
            type="button"
            onClick={onBatalkan}
            className="w-full sm:flex-1 h-[44px] sm:h-[46px] bg-[#FF0020] hover:bg-[#e0001c] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#FF0020]/50 focus-visible:outline-none rounded-[10px] text-white font-semibold text-[14px] sm:text-[15px] transition-all duration-150 cursor-pointer"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= MAIN MODAL =================
export default function TambahResepModal({ data, errors, onChange, onClose, onPublish, onSaveDraft }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  const inputText =
    'w-full h-[36px] px-3 rounded-[8px] bg-white border border-black/25 text-[12px] font-medium text-black placeholder-[#797777]/50 focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const inputArea =
    'w-full px-3 py-2 rounded-[8px] bg-white border border-black/25 text-[12px] font-medium text-black placeholder-[#797777]/50 focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition resize-y';
  const labelStyle = 'block text-[13px] font-bold text-black mb-1.5';

  const inputErr = (field: string) => (errors[field] ? 'border-[#D45060] bg-[#F88B92]/20' : '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maks 5MB');
      return;
    }
    onChange('image', file);
    const url = URL.createObjectURL(file);
    onChange('imagePreview', url);
  };

  // Klik Batal → tampilkan konfirmasi dulu
  const handleBatalClick = () => setShowBatalConfirm(true);

  // Konfirmasi "Ya, Batalkan" → tutup modal utama
  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 overflow-y-auto" onClick={handleBatalClick}>
        <div
          className="relative w-full max-w-[600px] my-6 bg-white rounded-[14px] border border-[#D9D9D9] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 pt-6 pb-8">
            <h1 className="text-[18px] font-semibold text-black leading-[22px]">Tambah Resep MPASI</h1>
            <p className="mt-2 text-[13px] font-normal text-black leading-[16px]">Lengkapi data resep di bawah ini!</p>

            <div className="flex justify-center mt-6 mb-6">
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[150px] h-[150px] rounded-[8px] bg-[#D9D9D9]/20 border border-dashed border-[#8F8F8F] flex flex-col items-center justify-center cursor-pointer hover:bg-[#D9D9D9]/30 transition-colors overflow-hidden"
              >
                {data.imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImagePlus className="w-[24px] h-[24px] text-[#AAA6A6]/70 mb-2.5" strokeWidth={2} />
                    <p className="text-[12px] font-medium text-[#8F8F8F] leading-[14px]">Unggah foto menu</p>
                    <p className="mt-1 text-[10px] font-medium text-[#797777]/50 leading-[12px]">JPG/PNG, maks 5MB</p>
                  </>
                )}
              </button>
            </div>

            <div className="mb-4">
              <label className={labelStyle}>Nama Resep</label>
              <input type="text" value={data.nama} onChange={(e) => onChange('nama', e.target.value)} placeholder="Contoh: Bubur Ayam Wortel" className={`${inputText} ${inputErr('nama')}`} />
            </div>

            <div className="mb-6">
              <label className={labelStyle}>Usia</label>
              <div className="flex flex-wrap gap-2">
                {USIA_RESEP_OPTIONS.map((usia) => {
                  const isActive = data.usia === usia;
                  return (
                    <button
                      key={usia}
                      type="button"
                      onClick={() => onChange('usia', usia)}
                      className={`h-[32px] px-3.5 rounded-[8px] font-semibold text-[12px] leading-[14px] transition-colors cursor-pointer ${
                        isActive ? 'bg-[#D45060] text-white' : 'bg-[#D9D9D9]/50 text-[#AAA6A6]/50 hover:bg-[#D9D9D9]/70'
                      }`}
                    >
                      {USIA_RESEP_LABELS[usia]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <label className={labelStyle}>Bahan</label>
              <textarea value={data.bahan} onChange={(e) => onChange('bahan', e.target.value)} rows={3} className={`${inputArea} min-h-[76px]`} />
            </div>

            <div className="mb-5">
              <label className={labelStyle}>Langkah Pembuatan</label>
              <textarea value={data.langkah} onChange={(e) => onChange('langkah', e.target.value)} rows={3} className={`${inputArea} min-h-[76px]`} />
            </div>

            <div className="mb-5">
              <label className={labelStyle}>Detail Nutrisi <span className="text-[#797777] font-normal">(per porsi)</span></label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-black/70 mb-1.5">Protein</p>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={data.protein} onChange={(e) => onChange('protein', e.target.value)} className={`${inputText} max-w-[90px]`} />
                    <span className="text-[12px] font-semibold text-[#8F8F8F]/80">gr</span>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-black/70 mb-1.5">Karbohidrat</p>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={data.karbohidrat} onChange={(e) => onChange('karbohidrat', e.target.value)} className={`${inputText} max-w-[90px]`} />
                    <span className="text-[12px] font-semibold text-[#8F8F8F]/80">gr</span>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-black/70 mb-1.5">Lemak</p>
                  <div className="flex items-center gap-1.5">
                    <input type="text" value={data.lemak} onChange={(e) => onChange('lemak', e.target.value)} className={`${inputText} max-w-[90px]`} />
                    <span className="text-[12px] font-semibold text-[#8F8F8F]/80">gr</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label className={labelStyle}>Estimasi Kalori</label>
              <div className="flex items-center gap-1.5">
                <input type="text" value={data.kalori} onChange={(e) => onChange('kalori', e.target.value)} className={`${inputText} max-w-[130px]`} />
                <span className="text-[12px] font-semibold text-[#8F8F8F]/80">kkal</span>
              </div>
            </div>

            <div className="mb-5">
              <label className={labelStyle}>Tips &amp; Penyimpanan <span className="text-[#797777] font-normal">(opsional)</span></label>
              <textarea value={data.tips} onChange={(e) => onChange('tips', e.target.value)} rows={3} className={`${inputArea} min-h-[76px]`} />
            </div>

            {/* Tombol aksi */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onPublish}
                className="h-[32px] px-5 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none rounded-[8px] text-white font-semibold text-[12px] leading-[14px] transition-all duration-150 cursor-pointer"
              >
                Publikasikan
              </button>
              <button
                type="button"
                onClick={onSaveDraft}
                className="h-[32px] px-5 bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[8px] text-[#8F8F8F] font-semibold text-[12px] leading-[14px] transition-all duration-150 cursor-pointer"
              >
                Simpan Draft
              </button>
              <button
                type="button"
                onClick={handleBatalClick}
                className="h-[32px] px-8 bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[8px] text-[#8F8F8F] font-semibold text-[12px] leading-[14px] transition-all duration-150 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI BATAL */}
      {showBatalConfirm && (
        <KonfirmasiBatalModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}