'use client';

import { useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import type { PemeriksaanForm } from '../types';
import { BAHAN_MAKANAN_LIST } from '../data';

type Props = {
  data: PemeriksaanForm;
  errors: Record<string, boolean>;
  mode?: 'add' | 'edit';
  onChange: (field: keyof PemeriksaanForm, value: string | string[]) => void;
  onToggleBahan: (bahan: string) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

// ================= DATE HELPERS =================
const BULAN_MAP: Record<string, string> = {
  Januari: '01', Februari: '02', Maret: '03', April: '04',
  Mei: '05', Juni: '06', Juli: '07', Agustus: '08',
  September: '09', Oktober: '10', November: '11', Desember: '12',
};
const BULAN_ARR = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

function parseTanggal(str: string): string {
  if (!str) return '';
  const parts = str.trim().split(' ');
  if (parts.length === 3 && BULAN_MAP[parts[1]]) {
    const day = parts[0].padStart(2, '0');
    const month = BULAN_MAP[parts[1]];
    return `${parts[2]}-${month}-${day}`;
  }
  if (str.includes('/')) {
    const [d, m, y] = str.split('/');
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return '';
}

function formatTanggal(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const bulan = BULAN_ARR[parseInt(month, 10) - 1] || '';
  return `${parseInt(day, 10)} ${bulan} ${year}`;
}

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
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onTetap}
    >
      <div
        className="relative w-full max-w-[480px] bg-white rounded-[14px] sm:rounded-[16px] shadow-2xl px-5 sm:px-8 pt-7 sm:pt-9 pb-6 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-black font-bold text-[18px] sm:text-[22px] leading-[1.25] sm:leading-[1.2]">
          Batalkan Pemeriksaan Ini?
        </h2>

        <p className="mt-3 sm:mt-4 text-center text-black text-[13px] sm:text-[15px] leading-[1.5] font-normal max-w-[420px] mx-auto">
          Data pengukuran yang sudah diisi belum tersimpan dan akan hilang. Yakin ingin membatalkan?
        </p>

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

// ================= MODAL PEMERIKSAAN =================
export default function PemeriksaanModal({
  data,
  errors,
  mode = 'add',
  onChange,
  onToggleBahan,
  onClose,
  onSave,
}: Props) {
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);
  const tglLahirRef = useRef<HTMLInputElement>(null);
  const tglPeriksaRef = useRef<HTMLInputElement>(null);

  const inputIdentitas =
    'w-full h-[40px] px-3 rounded-[8px] bg-[#D9D9D9]/45 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const inputParam =
    'w-full h-[40px] px-3 rounded-[8px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const labelStyle = 'block text-[13px] font-bold text-black mb-1.5';

  const inputErr = (field: string) => (errors[field] ? 'bg-[#F88B92]/40 border-[#D45060]' : '');
  const errText = (field: string) =>
    errors[field] ? <p className="mt-1 text-[11px] text-[#D45060] font-semibold">Wajib Diisi</p> : null;

  const title = mode === 'edit' ? 'Edit Pemeriksaan Stunting' : 'Pemeriksaan Stunting';

  const handleBatalClick = () => setShowBatalConfirm(true);
  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={handleBatalClick}>
        <div
          className="relative w-full max-w-[820px] max-h-[92vh] flex flex-col bg-white rounded-[16px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto px-7 pt-6 pb-5">
            <div className="mb-5">
              <h1 className="text-[20px] font-bold text-black leading-tight">{title}</h1>
              <p className="mt-1 text-[12px] text-black leading-snug">Pastikan data diinput sesuai dengan pengukuran fisik</p>
            </div>

            <div className="mb-5">
              <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Identitas Balita &amp; Orang Tua</h2>

              <div className="mb-3">
                <label className={labelStyle}>Nama Lengkap</label>
                <input type="text" value={data.nama} onChange={(e) => onChange('nama', e.target.value)} placeholder="Masukkan nama lengkap balita" className={`${inputIdentitas} ${inputErr('nama')}`} />
                {errText('nama')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
                <div>
                  <label className={labelStyle}>Jenis Kelamin</label>
                  <div className="flex rounded-[8px] overflow-hidden">
                    {/* Laki-laki: biru saat aktif */}
                    <button
                      type="button"
                      onClick={() => onChange('jenisKelamin', 'Laki - laki')}
                      className={`flex-1 h-[40px] flex items-center justify-center gap-2 font-semibold text-[13px] transition-colors cursor-pointer ${
                        data.jenisKelamin === 'Laki - laki'
                          ? 'bg-[#76C0EC]/70 text-[#1A5F8F]'
                          : 'bg-[#D9D9D9]/45 text-[#8F8F8F] hover:bg-[#D9D9D9]/60'
                      }`}
                    >
                      <span className="text-[15px] leading-none">♂</span>
                      <span>Laki-laki</span>
                    </button>
                    {/* Perempuan: pink #E76D73 saat aktif */}
                    <button
                      type="button"
                      onClick={() => onChange('jenisKelamin', 'Perempuan')}
                      className={`flex-1 h-[40px] flex items-center justify-center gap-2 font-semibold text-[13px] transition-colors cursor-pointer ${
                        data.jenisKelamin === 'Perempuan'
                          ? 'bg-[#E76D73] text-white'
                          : 'bg-[#D9D9D9]/45 text-[#8F8F8F] hover:bg-[#D9D9D9]/60'
                      }`}
                    >
                      <span className="text-[15px] leading-none">♀</span>
                      <span>Perempuan</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelStyle}>Usia</label>
                  <input type="text" value={data.usia} onChange={(e) => onChange('usia', e.target.value)} placeholder="Contoh: 15 Bulan" className={`${inputIdentitas} ${inputErr('usia')}`} />
                  {errText('usia')}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-3">
                <div>
                  <label className={labelStyle}>Tempat &amp; Tanggal lahir</label>
                  <div className="flex gap-2">
                    <input type="text" value={data.tempatLahir} onChange={(e) => onChange('tempatLahir', e.target.value)} placeholder="Tempat" className={`${inputIdentitas} flex-[1] ${inputErr('tempatLahir')}`} />
                    {/* 👇 Tanggal lahir pakai date picker */}
                    <div className="relative flex-[1.4]">
                      <input
                        type="text"
                        value={data.tanggalLahir}
                        readOnly
                        placeholder="Pilih tanggal"
                        className={`${inputIdentitas} pr-9 cursor-pointer ${inputErr('tanggalLahir')}`}
                      />
                      <input
                        ref={tglLahirRef}
                        type="date"
                        value={parseTanggal(data.tanggalLahir)}
                        onChange={(e) => onChange('tanggalLahir', formatTanggal(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        tabIndex={-1}
                        aria-label="Pilih tanggal lahir"
                      />
                      <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" />
                    </div>
                  </div>
                  {(errors.tempatLahir || errors.tanggalLahir) && (
                    <p className="mt-1 text-[11px] text-[#D45060] font-semibold">Wajib Diisi</p>
                  )}
                </div>
                <div>
                  <label className={labelStyle}>Nama Orang Tua</label>
                  <input type="text" value={data.namaOrtu} onChange={(e) => onChange('namaOrtu', e.target.value)} placeholder="Masukkan nama orang tua" className={`${inputIdentitas} ${inputErr('namaOrtu')}`} />
                  {errText('namaOrtu')}
                </div>
              </div>

              <div>
                <label className={labelStyle}>Email</label>
                <input type="email" value={data.email} onChange={(e) => onChange('email', e.target.value)} placeholder="nama@gmail.com" className={`${inputIdentitas} ${inputErr('email')}`} />
                {errText('email')}
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
              <div className="flex flex-wrap gap-2">
                {BAHAN_MAKANAN_LIST.map((bahan) => {
                  const isActive = data.bahanMakanan.includes(bahan);
                  return (
                    <button
                      key={bahan}
                      type="button"
                      onClick={() => onToggleBahan(bahan)}
                      className={`h-[36px] px-4 flex items-center justify-center rounded-full font-bold text-[12px] transition-all cursor-pointer border ${
                        isActive ? 'bg-[#F88B92]/50 border-[#D45060] text-black' : 'bg-[#D9D9D9]/30 border-black/50 text-black hover:bg-[#D9D9D9]/50'
                      }`}
                    >
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
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onChange('kondisi', 'Normal')} className={`h-[36px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Normal' ? 'bg-[#A8CEE0] text-[#006199]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Normal' ? 'bg-[#006199]' : 'bg-black'}`} />
                    <span>Normal</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Berisiko')} className={`h-[36px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Berisiko' ? 'bg-[#FFD444]/60 text-[#E38621]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Berisiko' ? 'bg-[#E38621]' : 'bg-black'}`} />
                    <span>Berisiko</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Stunting')} className={`h-[36px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Stunting' ? 'bg-[#FCEBD5] text-[#DD2E44]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Stunting' ? 'bg-[#DD2E44]' : 'bg-black'}`} />
                    <span>Stunting</span>
                  </button>
                </div>
              </div>

              <div className="max-w-[260px]">
                <label className={labelStyle}>Tanggal Pemeriksaan</label>
                {/* 👇 Tanggal pemeriksaan pakai date picker */}
                <div className="relative">
                  <input
                    type="text"
                    value={data.tanggalPemeriksaan}
                    readOnly
                    placeholder="Pilih tanggal"
                    className={`w-full h-[40px] px-3 pr-9 rounded-[8px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition cursor-pointer ${inputErr('tanggalPemeriksaan')}`}
                  />
                  <input
                    ref={tglPeriksaRef}
                    type="date"
                    value={parseTanggal(data.tanggalPemeriksaan)}
                    onChange={(e) => onChange('tanggalPemeriksaan', formatTanggal(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    tabIndex={-1}
                    aria-label="Pilih tanggal pemeriksaan"
                  />
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-black pointer-events-none" />
                </div>
                {errText('tanggalPemeriksaan')}
              </div>
            </div>
          </div>

          <div className="border-t border-[#AAA6A6]/40 bg-white px-7 py-3.5 flex items-center justify-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBatalClick}
                className="h-[42px] px-7 bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[10px] text-[#8F8F8F] font-bold text-[15px] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button type="button" onClick={onSave} className="h-[42px] px-7 bg-[#D45060] hover:bg-[#c44454] rounded-[10px] text-white font-bold text-[15px] transition-colors cursor-pointer">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {showBatalConfirm && (
        <KonfirmasiBatalModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}