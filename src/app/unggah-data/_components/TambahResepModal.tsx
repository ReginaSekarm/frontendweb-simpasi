'use client';

import { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import type { TambahResepForm } from '../_types';
import { USIA_RESEP_OPTIONS, USIA_RESEP_LABELS } from '../_data';

type Props = {
  data: TambahResepForm;
  errors: Record<string, boolean>;
  onChange: (field: keyof TambahResepForm, value: string | File | null) => void;
  onClose: () => void;
  onPublish: () => void;
  onSaveDraft: () => void;
};

export default function TambahResepModal({ data, errors, onChange, onClose, onPublish, onSaveDraft }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputText =
    'w-full h-[40px] px-4 rounded-[11px] bg-white border border-black/25 text-[15px] font-medium text-black placeholder-[#797777]/50 focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const inputArea =
    'w-full px-4 py-3 rounded-[11px] bg-white border border-black/25 text-[15px] font-medium text-black placeholder-[#797777]/50 focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition resize-y';
  const labelStyle = 'block text-[16px] font-bold text-black mb-2';

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

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="relative w-full max-w-[770px] my-8 bg-white rounded-[18px] border border-[#D9D9D9] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-[60px] pt-[40px] pb-[60px]">
          <h1 className="text-[22.5px] font-semibold text-black leading-[27px]">Tambah Resep MPASI</h1>
          <p className="mt-[12px] text-[17.5px] font-normal text-black leading-[21px]">Lengkapi data resep di bawah ini!</p>

          <div className="flex justify-center mt-[52px] mb-[57px]">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-[220px] h-[220px] rounded-[11px] bg-[#D9D9D9]/20 border border-dashed border-[#8F8F8F] flex flex-col items-center justify-center cursor-pointer hover:bg-[#D9D9D9]/30 transition-colors overflow-hidden"
            >
              {data.imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <ImagePlus className="w-[35px] h-[35px] text-[#AAA6A6]/70 mb-[18px]" strokeWidth={2} />
                  <p className="text-[17.5px] font-medium text-[#8F8F8F] leading-[21px]">Unggah foto menu</p>
                  <p className="mt-[8px] text-[14.3px] font-medium text-[#797777]/50 leading-[17px]">JPG/PNG, maks 5MB</p>
                </>
              )}
            </button>
          </div>

          <div className="mb-[24px]">
            <label className={labelStyle}>Nama Resep</label>
            <input type="text" value={data.nama} onChange={(e) => onChange('nama', e.target.value)} placeholder="Contoh: Bubur Ayam Wortel" className={`${inputText} ${inputErr('nama')}`} />
          </div>

          <div className="mb-[38px]">
            <label className={labelStyle}>Usia</label>
            <div className="flex flex-wrap gap-[13px]">
              {USIA_RESEP_OPTIONS.map((usia) => {
                const isActive = data.usia === usia;
                return (
                  <button
                    key={usia}
                    type="button"
                    onClick={() => onChange('usia', usia)}
                    className={`h-[40px] px-[20px] rounded-[11px] font-semibold text-[17.5px] leading-[21px] transition-colors cursor-pointer ${
                      isActive ? 'bg-[#D45060] text-white' : 'bg-[#D9D9D9]/50 text-[#AAA6A6]/50 hover:bg-[#D9D9D9]/70'
                    }`}
                  >
                    {USIA_RESEP_LABELS[usia]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-[36px]">
            <label className={labelStyle}>Bahan</label>
            <textarea value={data.bahan} onChange={(e) => onChange('bahan', e.target.value)} rows={3} className={`${inputArea} min-h-[103px]`} />
          </div>

          <div className="mb-[36px]">
            <label className={labelStyle}>Langkah Pembuatan</label>
            <textarea value={data.langkah} onChange={(e) => onChange('langkah', e.target.value)} rows={3} className={`${inputArea} min-h-[103px]`} />
          </div>

          <div className="mb-[36px]">
            <label className={labelStyle}>Detail Nutrisi <span className="text-[#797777] font-normal">(per porsi)</span></label>
            <div className="grid grid-cols-3 gap-[23px]">
              <div>
                <p className="text-[16.5px] font-semibold text-black/70 mb-2">Protein</p>
                <div className="flex items-center gap-[8px]">
                  <input type="text" value={data.protein} onChange={(e) => onChange('protein', e.target.value)} className={`${inputText} max-w-[120px]`} />
                  <span className="text-[16.5px] font-semibold text-[#8F8F8F]/80">gr</span>
                </div>
              </div>
              <div>
                <p className="text-[16.5px] font-semibold text-black/70 mb-2">Karbohidrat</p>
                <div className="flex items-center gap-[8px]">
                  <input type="text" value={data.karbohidrat} onChange={(e) => onChange('karbohidrat', e.target.value)} className={`${inputText} max-w-[120px]`} />
                  <span className="text-[16.5px] font-semibold text-[#8F8F8F]/80">gr</span>
                </div>
              </div>
              <div>
                <p className="text-[16.5px] font-semibold text-black/70 mb-2">Lemak</p>
                <div className="flex items-center gap-[8px]">
                  <input type="text" value={data.lemak} onChange={(e) => onChange('lemak', e.target.value)} className={`${inputText} max-w-[120px]`} />
                  <span className="text-[16.5px] font-semibold text-[#8F8F8F]/80">gr</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-[36px]">
            <label className={labelStyle}>Estimasi Kalori</label>
            <div className="flex items-center gap-[8px]">
              <input type="text" value={data.kalori} onChange={(e) => onChange('kalori', e.target.value)} className={`${inputText} max-w-[172px]`} />
              <span className="text-[16.5px] font-semibold text-[#8F8F8F]/80">kkal</span>
            </div>
          </div>

          <div className="mb-[35px]">
            <label className={labelStyle}>Tips &amp; Penyimpanan <span className="text-[#797777] font-normal">(opsional)</span></label>
            <textarea value={data.tips} onChange={(e) => onChange('tips', e.target.value)} rows={3} className={`${inputArea} min-h-[103px]`} />
          </div>

          <div className="flex flex-wrap items-center gap-[45px]">
            <button type="button" onClick={onPublish} className="h-[40px] px-[32px] bg-[#D45060] hover:bg-[#c44454] rounded-[11px] text-white font-semibold text-[17.5px] leading-[21px] transition-colors cursor-pointer">
              Publikasikan
            </button>
            <button type="button" onClick={onSaveDraft} className="h-[40px] px-[30px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[11px] text-[#8F8F8F] font-semibold text-[17.5px] leading-[21px] transition-colors cursor-pointer">
              Simpan Draft
            </button>
            <button type="button" onClick={onClose} className="h-[40px] px-[64px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[11px] text-[#8F8F8F] font-semibold text-[17.5px] leading-[21px] transition-colors cursor-pointer">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}