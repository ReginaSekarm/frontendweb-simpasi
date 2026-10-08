'use client';

import { useState } from 'react';
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
        <h2
          className="absolute font-semibold text-black text-center"
          style={{
            left: '157.79px',
            top: '78.52px',
            width: '371px',
            fontSize: '36.2392px',
            lineHeight: '44px',
          }}
        >
          Batalkan Perubahan?
        </h2>

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
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
        </p>

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

// ================= MODAL TAMBAH/EDIT =================
export default function BalitaFormModal({ mode, data, errors, onChange, onClose, onSave, onDelete }: Props) {
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  const inputIdentitas =
    'w-full h-[52px] px-4 rounded-[10px] bg-[#D9D9D9]/45 text-[#1a1a1a] placeholder-[#8F8F8F] text-[17px] font-medium focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const inputParam =
    'w-full h-[52px] px-4 rounded-[10px] bg-white border border-[#AAA6A6]/60 text-[#1a1a1a] placeholder-[#8F8F8F] text-[17px] font-medium focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition';
  const labelStyle = 'block text-[18px] font-bold text-black mb-2';

  const inputErr = (field: string) =>
    errors[field] ? 'bg-[#F88B92]/40 border-[#D45060]' : '';

  const errText = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-[13px] text-[#D45060] font-semibold">Wajib Diisi</p>
    ) : null;

  // Klik Batal → tampilkan konfirmasi
  const handleBatalClick = () => setShowBatalConfirm(true);

  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={handleBatalClick}>
        <div className="relative w-full max-w-[1100px] max-h-[92vh] flex flex-col bg-white rounded-[20px] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1 overflow-y-auto px-[42px] pt-[36px] pb-[28px]">
            <div className="mb-[28px]">
              <h1 className="text-[30px] font-bold text-black leading-tight">
                {mode === 'add' ? 'Tambah Data Balita' : 'Edit Data Balita'}
              </h1>
              <p className="mt-1 text-[15px] text-black leading-snug">
                Silakan lengkapi identitas balita dan parameter antropometri dengan benar
              </p>
            </div>

            {/* SECTION 1: IDENTITAS */}
            <div className="mb-[26px]">
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">
                Identitas Balita &amp; Orang Tua
              </h2>
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

            {/* SECTION 2: PARAMETER */}
            <div className="mb-[26px]">
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">
                Parameter Antropometri
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[18px]">
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
              <h2 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[18px]">Kondisi</h2>
              <div>
                <label className={labelStyle}>Kondisi Balita (Opsional)</label>
                <div className="flex flex-wrap gap-[12px]">
                  <button type="button" onClick={() => onChange('kondisi', 'Normal')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Normal' ? 'bg-[#A8CEE0] text-[#006199]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Normal' ? 'bg-[#006199]' : 'bg-black'}`} />
                    <span>Normal</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Stunting')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Stunting' ? 'bg-[#FCEBD5] text-[#DD2E44]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Stunting' ? 'bg-[#DD2E44]' : 'bg-black'}`} />
                    <span>Stunting</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Berisiko')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Berisiko' ? 'bg-[#FFD444]/60 text-[#E38621]' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Berisiko' ? 'bg-[#E38621]' : 'bg-black'}`} />
                    <span>Berisiko</span>
                  </button>
                  <button type="button" onClick={() => onChange('kondisi', 'Belum Diperiksa')} className={`h-[52px] px-[24px] flex items-center gap-[10px] rounded-[10px] font-bold text-[17px] transition-colors cursor-pointer ${data.kondisi === 'Belum Diperiksa' ? 'bg-[#8F8F8F]/80 text-white' : 'bg-white border border-[#AAA6A6] text-black hover:bg-[#F7F8F0]'}`}>
                    <span className={`w-[10px] h-[10px] rounded-full ${data.kondisi === 'Belum Diperiksa' ? 'bg-white' : 'bg-black'}`} />
                    <span>Belum Diperiksa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t border-[#AAA6A6]/40 bg-white px-[42px] py-[20px] flex items-center ${mode === 'edit' ? 'justify-between' : 'justify-end'}`}>
            {mode === 'edit' && (
              <button type="button" onClick={onDelete} className="h-[58px] px-[28px] flex items-center gap-[12px] border-2 border-[#FF0000] rounded-[12px] text-[#FF0000] font-bold text-[20px] hover:bg-[#D45060]/5 transition-colors cursor-pointer">
                <Trash2 className="w-[26px] h-[26px]" strokeWidth={2} />
                <span>Hapus</span>
              </button>
            )}
            <div className="flex items-center gap-[16px]">
              <button type="button" onClick={handleBatalClick} className="h-[58px] px-[44px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[12px] text-[#8F8F8F] font-bold text-[22px] transition-colors cursor-pointer">Batal</button>
              <button type="button" onClick={onSave} className="h-[58px] px-[44px] bg-[#D45060] hover:bg-[#c44454] rounded-[12px] text-white font-bold text-[22px] transition-colors cursor-pointer">Simpan</button>
            </div>
          </div>
        </div>
      </div>

      {/* Konfirmasi Batal */}
      {showBatalConfirm && (
        <KonfirmasiBatalModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}