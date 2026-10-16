'use client';

import { useRef, useState } from 'react';
import { Trash2, Calendar } from 'lucide-react';
import type { BalitaForm } from '../types';

type Props = {
  mode: 'add' | 'edit';
  data: BalitaForm;
  errors: Record<string, boolean>;
  onChange: (field: keyof BalitaForm, value: string) => void;
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
  // Support format "12 Maret 1989"
  const parts = str.trim().split(' ');
  if (parts.length === 3 && BULAN_MAP[parts[1]]) {
    const day = parts[0].padStart(2, '0');
    const month = BULAN_MAP[parts[1]];
    return `${parts[2]}-${month}-${day}`;
  }
  // Support format "DD/MM/YYYY"
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
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4"
      onClick={onTetap}
    >
      <div
        className="relative shadow-2xl bg-white"
        style={{
          width: '480px',
          height: '260px',
          borderRadius: '12px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="absolute font-semibold text-black text-center"
          style={{
            left: '50%',
            top: '42px',
            transform: 'translateX(-50%)',
            width: '400px',
            fontSize: '20px',
            lineHeight: '26px',
          }}
        >
          Batalkan Perubahan?
        </h2>

        <p
          className="absolute text-black text-center"
          style={{
            left: '50%',
            top: '88px',
            transform: 'translateX(-50%)',
            width: '400px',
            fontSize: '14px',
            lineHeight: '20px',
          }}
        >
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
        </p>

        <button
          type="button"
          onClick={onTetap}
          className="absolute font-semibold transition-colors hover:bg-[#c9c9c9] cursor-pointer bg-[#D9D9D9]"
          style={{
            left: '35px',
            top: '175px',
            width: '195px',
            height: '44px',
            borderRadius: '10px',
            fontSize: '16px',
            lineHeight: '20px',
            color: 'rgba(121, 119, 119, 0.8)',
          }}
        >
          Tetap di sini
        </button>

        <button
          type="button"
          onClick={onBatalkan}
          className="absolute font-semibold text-white transition-colors hover:bg-[#e0001c] cursor-pointer bg-[#FF0020]"
          style={{
            left: '250px',
            top: '175px',
            width: '195px',
            height: '44px',
            borderRadius: '10px',
            fontSize: '16px',
            lineHeight: '20px',
          }}
        >
          Ya, Batalkan
        </button>
      </div>
    </div>
  );
}

// ================= MODAL TAMBAH/EDIT =================
export default function BalitaFormModal({ mode, data, errors, onChange, onClose, onSave, onDelete }: Props) {
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const inputIdentitas =
    'w-full h-[40px] px-3 rounded-[8px] bg-[#D9D9D9]/45 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const inputParam =
    'w-full h-[40px] px-3 rounded-[8px] bg-white border border-[#AAA6A6]/60 text-[#1a1a1a] placeholder-[#8F8F8F] text-[13px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const labelStyle = 'block text-[13px] font-bold text-black mb-1.5';

  const inputErr = (field: string) =>
    errors[field] ? 'bg-[#F88B92]/40 border-[#D45060]' : '';

  const errText = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-[11px] text-[#D45060] font-semibold">Wajib Diisi</p>
    ) : null;

  const handleBatalClick = () => setShowBatalConfirm(true);

  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={handleBatalClick}>
        <div className="relative w-full max-w-[850px] max-h-[92vh] flex flex-col bg-white rounded-[16px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1 overflow-y-auto px-7 pt-6 pb-5">
            <div className="mb-5">
              <h1 className="text-[20px] font-bold text-black leading-tight">
                {mode === 'add' ? 'Tambah Data Balita' : 'Edit Data Balita'}
              </h1>
              <p className="mt-1 text-[12px] text-black leading-snug">
                Silakan lengkapi identitas balita dan parameter antropometri dengan benar
              </p>
            </div>

            {/* SECTION 1: IDENTITAS */}
            <div className="mb-5">
              <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">
                Identitas Balita &amp; Orang Tua
              </h2>
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
                    {/* Tanggal lahir pakai date picker */}
                    <div className="relative flex-[1.4]">
                      <input
                        type="text"
                        value={data.tanggalLahir}
                        readOnly
                        placeholder="Pilih tanggal"
                        className={`${inputIdentitas} pr-9 cursor-pointer ${inputErr('tanggalLahir')}`}
                      />
                      <input
                        ref={dateInputRef}
                        type="date"
                        value={parseTanggal(data.tanggalLahir)}
                        onChange={(e) => {
                          const formatted = formatTanggal(e.target.value);
                          onChange('tanggalLahir', formatted);
                        }}
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

            {/* SECTION 2: PARAMETER */}
            <div className="mb-5">
              <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">
                Parameter Antropometri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
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
            </div>

            {/* SECTION 3: KONDISI */}
            <div>
              <h2 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-3">Kondisi</h2>
              <div>
                <label className={labelStyle}>Kondisi Balita (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onChange('kondisi', 'Normal')} className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Normal' ? 'bg-[#A8CEE0] text-[#006199]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Normal' ? 'bg-[#006199]' : 'bg-black'}`} />
                    <span>Normal</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Stunting')} className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Stunting' ? 'bg-[#FCEBD5] text-[#DD2E44]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Stunting' ? 'bg-[#DD2E44]' : 'bg-black'}`} />
                    <span>Stunting</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Berisiko')} className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Berisiko' ? 'bg-[#FFD444]/60 text-[#E38621]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Berisiko' ? 'bg-[#E38621]' : 'bg-black'}`} />
                    <span>Berisiko</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Belum Diperiksa')} className={`h-[38px] px-4 flex items-center gap-2 rounded-[8px] font-bold text-[12px] transition-colors cursor-pointer ${data.kondisi === 'Belum Diperiksa' ? 'bg-[#8F8F8F]/80 text-white' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[8px] h-[8px] rounded-full ${data.kondisi === 'Belum Diperiksa' ? 'bg-white' : 'bg-black'}`} />
                    <span>Belum Diperiksa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`border-t border-[#AAA6A6]/40 bg-white px-7 py-3.5 flex items-center ${mode === 'edit' ? 'justify-between' : 'justify-end'}`}>
            {mode === 'edit' && (
              <button type="button" onClick={onDelete} className="h-[42px] px-5 flex items-center gap-2 border-2 border-[#FF0000] rounded-[10px] text-[#FF0000] font-bold text-[14px] hover:bg-[#D45060]/5 transition-colors cursor-pointer">
                <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
                <span>Hapus</span>
              </button>
            )}
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleBatalClick} className="h-[42px] px-7 bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[10px] text-[#8F8F8F] font-bold text-[15px] transition-colors cursor-pointer">Batal</button>
              <button type="button" onClick={onSave} className="h-[42px] px-7 bg-[#D45060] hover:bg-[#c44454] rounded-[10px] text-white font-bold text-[15px] transition-colors cursor-pointer">Simpan</button>
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