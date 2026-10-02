'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Calendar, ChevronDown } from 'lucide-react';

type Props = {
  onSaved: () => void;
  onClose?: () => void; // ada di mode edit → tampilkan tombol Batal
};

type ProfilKader = {
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noHp: string;
  foto: string;
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
        {/* Judul */}
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
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
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

// ================= MAIN MODAL =================
export default function LengkapiProfilModal({ onSaved, onClose }: Props) {
  const isEditMode = !!onClose;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Readonly
  const nama = 'Siti Amaliah';
  const email = 'siti.amaliah@gmail.com';
  const namaPosyandu = 'Posyandu Melati III';
  const jabatan = 'Kader Gizi';
  const wilayah = 'Kel. Lowokwaru, Kota Malang';
  const tanggalBergabung = '12 Maret 2022';

  // Editable
  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [nik, setNik] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [noHp, setNoHp] = useState('');

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showBatalConfirm, setShowBatalConfirm] = useState(false); // ✅ state konfirmasi batal

  // Pre-fill kalau mode edit
  useEffect(() => {
    if (!isEditMode) return;
    const saved = localStorage.getItem('simpasi_profil_kader');
    if (!saved) return;
    try {
      const data: ProfilKader = JSON.parse(saved);
      setNik(data.nik || '');
      setJenisKelamin(data.jenisKelamin || '');
      setTanggalLahir(data.tanggalLahir || '');
      setNoHp(data.noHp || '');
      setFotoPreview(data.foto || '');
    } catch {
      /* ignore */
    }
  }, [isEditMode]);

  const inputReadonly =
    'w-full h-[60px] px-5 rounded-[12px] bg-[#D9D9D9] text-[#3a3a3a] text-[17px] font-normal cursor-not-allowed';
  const inputEditable =
    'w-full h-[60px] px-5 rounded-[12px] bg-[#D9D9D9]/60 text-[#1a1a1a] text-[17px] font-normal placeholder-[#8F8F8F] focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelStyle = 'block text-[17px] font-bold text-black mb-2';

  const inputErr = (field: string) => (errors[field] ? 'ring-2 ring-[#D45060] bg-[#F88B92]/20' : '');

  const errText = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-[13px] text-[#D45060] font-semibold">Wajib Diisi</p>
    ) : null;

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

    const profilData: ProfilKader = { nik, jenisKelamin, tanggalLahir, noHp, foto: fotoPreview };
    localStorage.setItem('simpasi_profil_kader', JSON.stringify(profilData));
    console.log('Simpan profil:', profilData);
    onSaved();
  };

  // ✅ Klik Batal → tampilkan konfirmasi dulu
  const handleBatalClick = () => {
    setShowBatalConfirm(true);
  };

  // ✅ Klik "Ya, Batalkan" → benar-benar tutup modal
  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    onClose?.();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
        <div className="relative w-full max-w-[1100px] my-8 bg-white rounded-[24px] shadow-2xl">

          {/* Header */}
          <div className="px-[60px] pt-[44px] pb-[30px]">
            <h1 className="text-[32px] font-bold text-black leading-tight">
              {isEditMode ? 'Profil Kader' : 'Lengkapi Profil Kader'}
            </h1>
            {!isEditMode && (
              <p className="mt-[8px] text-[15px] text-[#8F8F8F]">
                Lengkapi data di bawah ini untuk melanjutkan ke dashboard.
              </p>
            )}
          </div>

          <div className="px-[60px] pb-[50px]">
            {/* ================= SECTION 1 ================= */}
            <h2 className="text-[#D45060] font-bold text-[16px] uppercase tracking-wide mb-[24px]">
              Foto &amp; Data Pribadi
            </h2>

            <div className="flex flex-col md:flex-row gap-[36px]">
              {/* Avatar */}
              <div className="shrink-0 self-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFotoChange}
                  className="hidden"
                />
                <div className="relative w-[180px] h-[180px]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full rounded-full overflow-hidden bg-white cursor-pointer"
                    aria-label="Unggah foto profil"
                  >
                    {fotoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
                        <circle cx="100" cy="100" r="96" fill="#F2F2F2" stroke="#D9D9D9" strokeWidth="8" />
                        <circle cx="100" cy="78" r="32" fill="#D9D9D9" />
                        <path d="M 40 170 Q 40 120 100 120 Q 160 120 160 170 Z" fill="#D9D9D9" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Ubah foto profil"
                    className="absolute bottom-0 right-0 w-[46px] h-[46px] rounded-full bg-[#D45060] hover:bg-[#c44454] flex items-center justify-center shadow-lg cursor-pointer border-[3px] border-white transition-all active:scale-95"
                  >
                    <Pencil className="w-[20px] h-[20px] text-white" strokeWidth={2.4} />
                  </button>
                </div>

                {!isEditMode && (
                  <p className="mt-3 text-center text-[13px] text-[#8F8F8F]">(Opsional)</p>
                )}
              </div>

              {/* Form */}
              <div className="flex-1 min-w-0">
                <div className="mb-[18px]">
                  <label className={labelStyle}>Nama Lengkap</label>
                  <input type="text" value={nama} disabled className={inputReadonly} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[18px] mb-[18px]">
                  <div>
                    <label className={labelStyle}>
                      NIK {!isEditMode && <span className="text-[#FF0020]">*</span>}
                    </label>
                    <input
                      type="text"
                      value={nik}
                      onChange={(e) => {
                        setNik(e.target.value.replace(/\D/g, '').slice(0, 16));
                        if (errors.nik) setErrors((p) => ({ ...p, nik: false }));
                      }}
                      placeholder="16 digit NIK"
                      className={`${inputEditable} ${inputErr('nik')}`}
                    />
                    {errText('nik')}
                  </div>
                  <div>
                    <label className={labelStyle}>
                      Jenis Kelamin {!isEditMode && <span className="text-[#FF0020]">*</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={jenisKelamin}
                        onChange={(e) => {
                          setJenisKelamin(e.target.value);
                          if (errors.jenisKelamin) setErrors((p) => ({ ...p, jenisKelamin: false }));
                        }}
                        className={`${inputEditable} appearance-none pr-12 cursor-pointer ${inputErr('jenisKelamin')}`}
                      >
                        <option value="">Pilih</option>
                        <option value="Laki - laki">Laki - laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-[24px] h-[24px] text-black pointer-events-none" strokeWidth={2.5} />
                    </div>
                    {errText('jenisKelamin')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[18px] mb-[18px]">
                  <div>
                    <label className={labelStyle}>
                      Tanggal Lahir {!isEditMode && <span className="text-[#FF0020]">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tanggalLahir}
                        onChange={(e) => {
                          setTanggalLahir(e.target.value);
                          if (errors.tanggalLahir) setErrors((p) => ({ ...p, tanggalLahir: false }));
                        }}
                        placeholder="dd/mm/yy"
                        className={`${inputEditable} pr-14 ${inputErr('tanggalLahir')}`}
                      />
                      <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 w-[26px] h-[26px] text-[#8F8F8F] pointer-events-none" strokeWidth={2} />
                    </div>
                    {errText('tanggalLahir')}
                  </div>
                  <div>
                    <label className={labelStyle}>
                      No.HP/Whatsapp {!isEditMode && <span className="text-[#FF0020]">*</span>}
                    </label>
                    <input
                      type="text"
                      value={noHp}
                      onChange={(e) => {
                        setNoHp(e.target.value.replace(/\D/g, ''));
                        if (errors.noHp) setErrors((p) => ({ ...p, noHp: false }));
                      }}
                      placeholder="08xxxxxxxxxx"
                      className={`${inputEditable} ${inputErr('noHp')}`}
                    />
                    {errText('noHp')}
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>Email</label>
                  <input type="text" value={email} disabled className={inputReadonly} />
                </div>
              </div>
            </div>

            {/* ================= SECTION 2 ================= */}
            <h2 className="text-[#D45060] font-bold text-[16px] uppercase tracking-wide mt-[44px] mb-[24px]">
              Data Tugas Posyandu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[36px] gap-y-[22px]">
              <div>
                <label className={labelStyle}>Nama Posyandu</label>
                <input type="text" value={namaPosyandu} disabled className={inputReadonly} />
              </div>
              <div>
                <label className={labelStyle}>Jabatan</label>
                <input type="text" value={jabatan} disabled className={inputReadonly} />
              </div>
              <div>
                <label className={labelStyle}>Wilayah</label>
                <input type="text" value={wilayah} disabled className={inputReadonly} />
              </div>
              <div>
                <label className={labelStyle}>Tanggal Bergabung</label>
                <input type="text" value={tanggalBergabung} disabled className={inputReadonly} />
              </div>
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className={`mt-[44px] flex items-center ${isEditMode ? 'justify-end gap-[16px]' : 'justify-end'}`}>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleBatalClick} // ✅ trigger konfirmasi
                  className="h-[66px] px-[56px] bg-[#D9D9D9] hover:bg-[#c9c9c9] text-[#8F8F8F] text-[24px] font-bold rounded-[14px] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Batal
                </button>
              )}
              <button
                type="button"
                onClick={handleSimpan}
                className="h-[66px] px-[56px] bg-[#D45060] hover:bg-[#c44454] text-white text-[24px] font-bold rounded-[14px] transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Modal konfirmasi Batal — muncul di atas modal edit */}
      {showBatalConfirm && (
        <BatalKonfirmasiModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </>
  );
}