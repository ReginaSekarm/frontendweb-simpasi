'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import type { PemeriksaanForm } from '../_types';
import { BAHAN_MAKANAN_LIST } from '../_data';

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
        className="relative shadow-2xl"
        style={{
          width: '693.83px',
          height: '377.49px',
          background: '#FFFFFF',
          borderRadius: '15.0997px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul */}
        <h2
          className="absolute font-semibold text-black text-center"
          style={{
            left: '90px',
            top: '78.52px',
            width: '500px',
            fontSize: '36.2392px',
            lineHeight: '44px',
          }}
        >
          Batalkan Pemeriksaan Ini?
        </h2>

        {/* Deskripsi */}
        <p
          className="absolute text-black text-center"
          style={{
            left: '81.54px',
            top: '138.16px',
            width: '521px',
            fontSize: '24.1595px',
            lineHeight: '29px',
          }}
        >
          Data pengukuran yang sudah diisi belum tersimpan dan akan hilang. Yakin ingin membatalkan?
        </p>

        {/* Button: Tetap di sini */}
        <button
          type="button"
          onClick={onTetap}
          className="absolute font-semibold transition-colors hover:bg-[#c9c9c9] cursor-pointer"
          style={{
            left: '89.84px',
            top: '254.43px',
            width: '226.5px',
            height: '52.85px',
            background: '#D9D9D9',
            borderRadius: '15.0997px',
            fontSize: '27.1794px',
            lineHeight: '33px',
            color: 'rgba(121, 119, 119, 0.8)',
          }}
        >
          Tetap di sini
        </button>

        {/* Button: Ya, Batalkan */}
        <button
          type="button"
          onClick={onBatalkan}
          className="absolute font-semibold text-white transition-colors hover:bg-[#e0001c] cursor-pointer"
          style={{
            left: '369.94px',
            top: '252.16px',
            width: '226.5px',
            height: '52.85px',
            background: '#FF0020',
            borderRadius: '15.0997px',
            fontSize: '27.1794px',
            lineHeight: '33px',
          }}
        >
          Ya, Batalkan
        </button>
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

  const inputIdentitas =
    'w-full h-[52px] px-4 rounded-[10px] bg-[#D9D9D9]/45 text-[#1a1a1a] placeholder-[#8F8F8F] text-[17px] font-medium focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const inputParam =
    'w-full h-[52px] px-4 rounded-[10px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[17px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const labelStyle = 'block text-[18px] font-bold text-black mb-2';

  const inputErr = (field: string) => (errors[field] ? 'bg-[#F88B92]/40 border-[#D45060]' : '');
  const errText = (field: string) =>
    errors[field] ? <p className="mt-1 text-[13px] text-[#D45060] font-semibold">Wajib Diisi</p> : null;

  const title = mode === 'edit' ? 'Edit Pemeriksaan Stunting' : 'Pemeriksaan Stunting';

  const handleBatalClick = () => {
    setShowBatalConfirm(true);
  };

  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={handleBatalClick}>
        <div
          className="relative w-full max-w-[1100px] max-h-[92vh] flex flex-col bg-white rounded-[20px] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto px-[42px] pt-[36px] pb-[28px]">
            <div className="mb-[28px]">
              <h1 className="text-[30px] font-bold text-black leading-tight">{title}</h1>
              <p className="mt-1 text-[15px] text-black leading-snug">Pastikan data diinput sesuai dengan pengukuran fisik</p>
            </div>

            <div className="mb-[26px]">
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">Identitas Balita &amp; Orang Tua</h2>

              <div className="mb-[18px]">
                <label className={labelStyle}>Nama Lengkap</label>
                <input type="text" value={data.nama} onChange={(e) => onChange('nama', e.target.value)} placeholder="Masukkan nama lengkap balita" className={`${inputIdentitas} ${inputErr('nama')}`} />
                {errText('nama')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[18px] mb-[18px]">
                <div>
                  <label className={labelStyle}>Jenis Kelamin</label>
                  <div className="flex rounded-[10px] overflow-hidden">
                    <button type="button" onClick={() => onChange('jenisKelamin', 'Laki - laki')} className={`flex-1 h-[52px] flex items-center justify-center gap-[10px] font-semibold text-[17px] transition-colors cursor-pointer ${data.jenisKelamin === 'Laki - laki' ? 'bg-[#76C0EC]/70 text-[#1A5F8F]' : 'bg-[#D9D9D9]/45 text-[#8F8F8F] hover:bg-[#D9D9D9]/60'}`}>
                      <span className="text-[20px] leading-none">♂</span>
                      <span>Laki-laki</span>
                    </button>
                    <button type="button" onClick={() => onChange('jenisKelamin', 'Perempuan')} className={`flex-1 h-[52px] flex items-center justify-center gap-[10px] font-semibold text-[17px] transition-colors cursor-pointer ${data.jenisKelamin === 'Perempuan' ? 'bg-[#76C0EC]/70 text-[#1A5F8F]' : 'bg-[#D9D9D9]/45 text-[#8F8F8F] hover:bg-[#D9D9D9]/60'}`}>
                      <span className="text-[20px] leading-none">♀</span>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[18px] mb-[18px]">
                <div>
                  <label className={labelStyle}>Tempat &amp; Tanggal lahir</label>
                  <div className="flex gap-[10px]">
                    <input type="text" value={data.tempatLahir} onChange={(e) => onChange('tempatLahir', e.target.value)} placeholder="Tempat" className={`${inputIdentitas} flex-[1] ${inputErr('tempatLahir')}`} />
                    <div className="relative flex-[1.4]">
                      <input type="text" value={data.tanggalLahir} onChange={(e) => onChange('tanggalLahir', e.target.value)} placeholder="DD/MM/YYYY" className={`${inputIdentitas} pr-11 ${inputErr('tanggalLahir')}`} />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-black pointer-events-none" />
                    </div>
                  </div>
                  {(errors.tempatLahir || errors.tanggalLahir) && (
                    <p className="mt-1 text-[13px] text-[#D45060] font-semibold">Wajib Diisi</p>
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

            <div className="mb-[26px]">
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">Parameter Antropometri</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[18px] mb-[18px]">
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
                <textarea value={data.catatan} onChange={(e) => onChange('catatan', e.target.value)} placeholder="Tulis catatan pemeriksaan di sini..." rows={4} className="w-full px-4 py-3 rounded-[10px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[16px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition resize-y" />
              </div>
            </div>

            <div className="mb-[26px]">
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">Bahan Makanan Yang Direkomendasikan</h2>
              <div className="flex flex-wrap gap-[14px]">
                {BAHAN_MAKANAN_LIST.map((bahan) => {
                  const isActive = data.bahanMakanan.includes(bahan);
                  return (
                    <button
                      key={bahan}
                      type="button"
                      onClick={() => onToggleBahan(bahan)}
                      className={`h-[52px] px-[26px] flex items-center justify-center rounded-full font-bold text-[17px] transition-all cursor-pointer border ${
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
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">Kondisi &amp; Tanggal Pemeriksaan</h2>

              <div className="mb-[20px]">
                <label className={labelStyle}>Kondisi Balita</label>
                <div className="flex flex-wrap gap-[12px]">
                  <button type="button" onClick={() => onChange('kondisi', 'Normal')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Normal' ? 'bg-[#A8CEE0] text-[#006199]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Normal' ? 'bg-[#006199]' : 'bg-black'}`} />
                    <span>Normal</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Berisiko')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Berisiko' ? 'bg-[#FFD444]/60 text-[#E38621]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Berisiko' ? 'bg-[#E38621]' : 'bg-black'}`} />
                    <span>Berisiko</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Stunting')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Stunting' ? 'bg-[#FCEBD5] text-[#DD2E44]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Stunting' ? 'bg-[#DD2E44]' : 'bg-black'}`} />
                    <span>Stunting</span>
                  </button>
                </div>
              </div>

              <div className="max-w-[300px]">
                <label className={labelStyle}>Tanggal Pemeriksaan</label>
                <div className="relative">
                  <input type="text" value={data.tanggalPemeriksaan} onChange={(e) => onChange('tanggalPemeriksaan', e.target.value)} placeholder="dd/mm/yyyy" className={`w-full h-[52px] px-4 pr-12 rounded-[10px] bg-[#D9D9D9]/30 border border-black/50 text-[#1a1a1a] placeholder-[#8F8F8F] text-[16px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition ${inputErr('tanggalPemeriksaan')}`} />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-black pointer-events-none" />
                </div>
                {errText('tanggalPemeriksaan')}
              </div>
            </div>
          </div>

          <div className="border-t border-[#AAA6A6]/40 bg-white px-[42px] py-[20px] flex items-center justify-end">
            <div className="flex items-center gap-[16px]">
              <button
                type="button"
                onClick={handleBatalClick}
                className="h-[58px] px-[44px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[12px] text-[#8F8F8F] font-bold text-[22px] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button type="button" onClick={onSave} className="h-[58px] px-[44px] bg-[#D45060] hover:bg-[#c44454] rounded-[12px] text-white font-bold text-[22px] transition-colors cursor-pointer">
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ KONFIRMASI BATAL ============ */}
      {showBatalConfirm && (
        <KonfirmasiBatalModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}