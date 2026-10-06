'use client';

import React, { useRef, useState } from 'react';
import { Pencil, Calendar, ChevronDown } from 'lucide-react';

type Props = {
  onSaved: () => void;
  onClose?: () => void; // ada di mode edit → tampilkan tombol Batal
};

// ================= KONFIRMASI BATAL =================
function BatalKonfirmasiModal({
  onTetap,
  onBatalkan,
}: {
  onTetap: () => void;
  onBatalkan: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4">
      <div
        className="relative shadow-2xl"
        style={{
          width: '693.83px',
          height: '377.49px',
          background: '#FFFFFF',
          borderRadius: '15.0997px',
        }}
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

// ================= MAIN MODAL =================
export default function LengkapiProfilModal({ onSaved, onClose }: Props) {
  const isEditMode = !!onClose;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== Readonly (dari backend) =====
  const nama = 'Siti Amaliah';
  const email = 'siti.amaliah@gmail.com';
  const namaPosyandu = 'Posyandu Melati III';
  const jabatan = 'Kader Gizi';
  const wilayah = 'Kel. Lowokwaru, Kota Malang';
  const tanggalBergabung = '12 Maret 2022';

  // ===== Editable — DUMMY default =====
  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [nik, setNik] = useState('3578011203890004');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [tanggalLahir, setTanggalLahir] = useState('12 Maret 1989');
  const [noHp, setNoHp] = useState('0812-3456-7890');

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  // ===== Styles (sesuai Figma) =====
  const inputBase =
    'w-full h-[56.24px] px-[20px] rounded-[16.87px] bg-[#D9D9D9] text-[16.87px] font-medium text-black/80 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelBase = 'block text-[16.87px] font-semibold text-black leading-[20px] mb-[10px]';
  const sectionTitle = 'text-[16.87px] font-bold text-[#D45060] leading-[20px] uppercase';

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maks 2MB');
      return;
    }
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSimpan = () => {
    const errs: Record<string, boolean> = {};
    if (!nik.trim()) errs.nik = true;
    if (!jenisKelamin) errs.jenisKelamin = true;
    if (!tanggalLahir.trim()) errs.tanggalLahir = true;
    if (!noHp.trim()) errs.noHp = true;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    console.log('Simpan profil:', { nik, jenisKelamin, tanggalLahir, noHp, fotoPreview });
    onSaved();
  };

  const handleBatalClick = () => setShowBatalConfirm(true);
  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="relative w-full max-w-[1010px] my-8 bg-white rounded-[17px] shadow-2xl px-[54px] pt-[37px] pb-[60px]">

          {/* ============ TITLE ============ */}
          <h1 className="text-[24.745px] font-bold text-black leading-[30px] mb-[34px]">
            Profil Kader
          </h1>

          {/* ============ SECTION 1: FOTO & DATA PRIBADI ============ */}
          <h2 className={`${sectionTitle} mb-[42px]`}>Foto &amp; Data Pribadi</h2>

          <div className="flex gap-[58px]">
            {/* Avatar */}
            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFotoChange}
                className="hidden"
              />
              <div className="relative w-[168.72px] h-[168.72px]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full rounded-full overflow-hidden bg-[#D9D9D9] cursor-pointer"
                  aria-label="Unggah foto profil"
                >
                  {fotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/profil-kader.png"
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </button>

                {/* Icon Pencil — bulat merah border putih */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Ubah foto profil"
                  className="absolute bottom-[2px] right-[2px] w-[40px] h-[40px] rounded-full bg-[#D45060] hover:bg-[#c44454] flex items-center justify-center border-[3px] border-white shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Pencil className="w-[20px] h-[20px] text-white" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 min-w-0 space-y-[36px]">
              {/* Nama Lengkap (readonly) */}
              <div>
                <label className={labelBase}>Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  readOnly
                  className={`${inputBase} cursor-not-allowed`}
                />
              </div>

              {/* NIK + Jenis Kelamin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[13px] gap-y-[24px]">
                <div>
                  <label className={labelBase}>NIK</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => {
                      setNik(e.target.value.replace(/\D/g, '').slice(0, 16));
                      if (errors.nik) setErrors((p) => ({ ...p, nik: false }));
                    }}
                    className={`${inputBase} ${errors.nik ? 'ring-2 ring-[#D45060]' : ''}`}
                  />
                </div>
                <div>
                  <label className={labelBase}>Jenis Kelamin</label>
                  <div className="relative">
                    <select
                      value={jenisKelamin}
                      onChange={(e) => {
                        setJenisKelamin(e.target.value);
                        if (errors.jenisKelamin) setErrors((p) => ({ ...p, jenisKelamin: false }));
                      }}
                      className={`${inputBase} appearance-none pr-[50px] cursor-pointer ${errors.jenisKelamin ? 'ring-2 ring-[#D45060]' : ''}`}
                    >
                      <option value="Laki - laki">Laki - laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <ChevronDown
                      className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[24px] h-[24px] text-black pointer-events-none"
                      strokeWidth={2.2}
                    />
                  </div>
                </div>
              </div>

              {/* Tanggal Lahir + No.HP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[13px] gap-y-[24px]">
                <div>
                  <label className={labelBase}>Tanggal Lahir</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tanggalLahir}
                      onChange={(e) => {
                        setTanggalLahir(e.target.value);
                        if (errors.tanggalLahir) setErrors((p) => ({ ...p, tanggalLahir: false }));
                      }}
                      className={`${inputBase} pr-[50px] ${errors.tanggalLahir ? 'ring-2 ring-[#D45060]' : ''}`}
                    />
                    <Calendar
                      className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-black pointer-events-none"
                      strokeWidth={2}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelBase}>No.HP/Whatsapp</label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => {
                      setNoHp(e.target.value.replace(/\D/g, ''));
                      if (errors.noHp) setErrors((p) => ({ ...p, noHp: false }));
                    }}
                    className={`${inputBase} ${errors.noHp ? 'ring-2 ring-[#D45060]' : ''}`}
                  />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className={labelBase}>Email</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className={`${inputBase} cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          {/* ============ SECTION 2: DATA TUGAS POSYANDU ============ */}
          <h2 className={`${sectionTitle} mt-[66px] mb-[54px]`}>Data Tugas Posyandu</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] gap-y-[30px]">
            <div>
              <label className={labelBase}>Nama Posyandu</label>
              <input type="text" value={namaPosyandu} readOnly className={`${inputBase} cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelBase}>Jabatan</label>
              <input type="text" value={jabatan} readOnly className={`${inputBase} cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelBase}>Wilayah</label>
              <input type="text" value={wilayah} readOnly className={`${inputBase} cursor-not-allowed`} />
            </div>
            <div>
              <label className={labelBase}>Tanggal Bergabung</label>
              <input type="text" value={tanggalBergabung} readOnly className={`${inputBase} cursor-not-allowed`} />
            </div>
          </div>

          {/* ============ ACTION BUTTONS ============ */}
          <div className="mt-[72px] flex items-center justify-end gap-[22px]">
            {isEditMode && (
              <button
                type="button"
                onClick={handleBatalClick}
                className="w-[157.47px] h-[44.99px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[11.25px] text-[#8F8F8F] text-[22.4954px] font-medium leading-[27px] transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              onClick={handleSimpan}
              className="w-[157.47px] h-[44.99px] bg-[#D45060] hover:bg-[#c44454] rounded-[11.25px] text-white text-[22.4954px] font-medium leading-[27px] transition-colors cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>

      {/* Konfirmasi Batal */}
      {showBatalConfirm && (
        <BatalKonfirmasiModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}