'use client';

import { Calendar, Check, Trash2 } from 'lucide-react';
import type { Balita, PemeriksaanForm } from '../types';
import { BAHAN_MAKANAN_LIST } from '../data';

type Props = {
  balita: Balita;
  data: PemeriksaanForm;
  errors: Record<string, boolean>;
  onChange: (field: keyof PemeriksaanForm, value: string | string[]) => void;
  onToggleBahan: (bahan: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

export default function PemeriksaanModal({ balita, data, errors, onChange, onToggleBahan, onClose, onSave, onDelete }: Props) {
  // 👇 Ukuran input dan label diperkecil
  const inputReadonly = 'w-full h-[40px] px-3 rounded-[8px] bg-[#D9D9D9] text-[#5a5a5a] text-[13px] font-semibold cursor-not-allowed';
  const inputParam =
    'w-full h-[40px] px-3 rounded-[8px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const labelStyle = 'block text-[13px] font-bold text-black mb-1.5';

  const inputErr = (field: string) => (errors[field] ? 'bg-[#F88B92]/40 border-[#D45060]' : '');
  const errText = (field: string) =>
    errors[field] ? <p className="mt-1 text-[11px] text-[#D45060] font-semibold">Wajib Diisi</p> : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      {/* 👇 Ukuran modal utama diperkecil dari 1100px menjadi 850px */}
      <div className="relative w-full max-w-[850px] max-h-[92vh] flex flex-col bg-white rounded-[16px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 overflow-y-auto px-7 pt-6 pb-5">
          {/* 👇 Ukuran judul dan deskripsi modal diperkecil */}
          <div className="mb-5">
            <h1 className="text-[20px] font-bold text-black leading-tight">Pemeriksaan Stunting</h1>
            <p className="mt-1 text-[12px] text-black leading-snug">Pastikan data diinput sesuai dengan pengukuran fisik(BLOM FIKS)</p>
          </div>

          <div className="mb-5">
            <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Identitas Balita &amp; Orang Tua</h2>

            <div className="mb-3">
              <label className={labelStyle}>Nama Lengkap</label>
              <input type="text" value={balita.nama} disabled className={inputReadonly} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div>
                <label className={labelStyle}>Jenis Kelamin</label>
                {/* 👇 Tombol jenis kelamin diperkecil */}
                <div className="flex rounded-[8px] overflow-hidden">
                  <div className={`flex-1 h-[40px] flex items-center justify-center gap-2 font-semibold text-[13px] ${balita.jenisKelamin === 'Laki - laki' ? 'bg-[#518EB6] text-white' : 'bg-[#D9D9D9] text-[#8F8F8F]'}`}>
                    <span className="text-[15px] leading-none">♂</span>
                    <span>Laki-laki</span>
                  </div>
                  <div className={`flex-1 h-[40px] flex items-center justify-center gap-2 font-semibold text-[13px] ${balita.jenisKelamin === 'Perempuan' ? 'bg-[#518EB6] text-white' : 'bg-[#D9D9D9] text-[#8F8F8F]'}`}>
                    <span className="text-[15px] leading-none">♀</span>
                    <span>Perempuan</span>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelStyle}>Usia</label>
                <input type="text" value={balita.usia} disabled className={inputReadonly} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <div>
                <label className={labelStyle}>Tempat &amp; Tanggal lahir</label>
                <div className="flex gap-2">
                  <input type="text" value={balita.tempatLahir} disabled className={`${inputReadonly} flex-[1]`} />
                  <div className="relative flex-[1.4]">
                    <input type="text" value={balita.tanggalLahir} disabled className={`${inputReadonly} pr-9`} />
                    {/* 👇 Icon kalender diperkecil */}
                    <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelStyle}>Nama Orang Tua</label>
                <input type="text" value={balita.namaOrtu} disabled className={inputReadonly} />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Email</label>
              <input type="email" value={balita.email} disabled className={inputReadonly} />
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Parameter Antropometri</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 mb-3">
              <div>
                <label className={labelStyle}>BB (kg)</label>
                <input type="text" value={data.bb} onChange={(e) => onChange('bb', e.target.value)} placeholder="0" className={`${inputParam} ${inputErr('bb')}`} />
                {errText('bb')}
              </div>
              <div>
                <label className={labelStyle}>TB (cm)</label>
                <input type="text" value={data.tb} onChange={(e) => onChange('tb', e.target.value)} placeholder="0" className={`${inputParam} ${inputErr('tb')}`} />
                {errText('tb')}
              </div>
              <div>
                <label className={labelStyle}>LK (cm)</label>
                <input type="text" value={data.lk} onChange={(e) => onChange('lk', e.target.value)} placeholder="0" className={`${inputParam} ${inputErr('lk')}`} />
                {errText('lk')}
              </div>
              <div>
                <label className={labelStyle}>LiLA (cm)</label>
                <input type="text" value={data.lila} onChange={(e) => onChange('lila', e.target.value)} placeholder="0" className={`${inputParam} ${inputErr('lila')}`} />
                {errText('lila')}
              </div>
            </div>

            <div>
              <label className={labelStyle}>Catatan</label>
              <textarea 
                value={data.catatan} 
                onChange={(e) => onChange('catatan', e.target.value)} 
                placeholder="Tulis catatan pemeriksaan di sini..." 
                rows={3} 
                className="w-full px-3 py-2 rounded-[8px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition resize-y" 
              />
            </div>
          </div>

          <div className="mb-5">
            <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Bahan Makanan Yang Direkomendasikan</h2>
            {/* 👇 Tombol bahan makanan diperkecil */}
            <div className="flex flex-wrap gap-2">
              {BAHAN_MAKANAN_LIST.map((bahan) => {
                const isActive = data.bahanMakanan.includes(bahan);
                return (
                  <button 
                    key={bahan} 
                    type="button" 
                    onClick={() => onToggleBahan(bahan)} 
                    className={`h-[38px] px-4 flex items-center gap-2 rounded-full font-bold text-[12px] transition-all cursor-pointer border ${isActive ? 'bg-[#F88B92]/50 border-[#D45060] text-black' : 'bg-[#D9D9D9]/30 border-black/50 text-black hover:bg-[#D9D9D9]/50'}`}
                  >
                    {isActive && <Check className="w-[14px] h-[14px]" strokeWidth={3} />}
                    <span>{bahan}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Kondisi &amp; Tanggal Pemeriksaan</h2>

            <div className="mb-4">
              <label className={labelStyle}>Kondisi Balita</label>
              {/* 👇 Tombol kondisi diperkecil */}
              <div className="flex flex-wrap gap-2">
                <button 
                  type="button" 
                  onClick={() => onChange('kondisi', 'Normal')} 
                  className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Normal' ? 'bg-[#A8CEE0] text-[#006199]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}
                >
                  <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Normal' ? 'bg-[#006199]' : 'bg-black'}`} />
                  <span>Normal</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => onChange('kondisi', 'Berisiko')} 
                  className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Berisiko' ? 'bg-[#FFD444]/60 text-[#E38621]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}
                >
                  <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Berisiko' ? 'bg-[#E38621]' : 'bg-black'}`} />
                  <span>Berisiko</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => onChange('kondisi', 'Stunting')} 
                  className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Stunting' ? 'bg-[#FCEBD5] text-[#DD2E44]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}
                >
                  <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Stunting' ? 'bg-[#DD2E44]' : 'bg-black'}`} />
                  <span>Stunting</span>
                </button>
              </div>
            </div>

            <div className="max-w-[260px]">
              <label className={labelStyle}>Tanggal Pemeriksaan</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={data.tanggalPemeriksaan} 
                  onChange={(e) => onChange('tanggalPemeriksaan', e.target.value)} 
                  placeholder="dd/mm/yyyy" 
                  className={`w-full h-[40px] px-3 pr-9 rounded-[8px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition ${inputErr('tanggalPemeriksaan')}`} 
                />
                {/* 👇 Icon kalender diperkecil */}
                <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-black pointer-events-none" />
              </div>
              {errText('tanggalPemeriksaan')}
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* 👇 Padding footer dan ukuran tombol diperkecil */}
        <div className="border-t border-[#AAA6A6]/40 bg-white px-7 py-3.5 flex items-center justify-between">
          <button 
            type="button" 
            onClick={onDelete} 
            className="h-[42px] px-5 flex items-center gap-2 border-2 border-[#FF0000] rounded-[10px] text-[#FF0000] font-bold text-[14px] hover:bg-[#D45060]/5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>Hapus</span>
          </button>
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="h-[42px] px-7 bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[10px] text-[#8F8F8F] font-bold text-[15px] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              type="button" 
              onClick={onSave} 
              className="h-[42px] px-7 bg-[#D45060] hover:bg-[#c44454] rounded-[10px] text-white font-bold text-[15px] transition-colors cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}