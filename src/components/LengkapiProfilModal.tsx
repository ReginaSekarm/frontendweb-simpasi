'use client';

import React, { useRef, useState } from 'react';
import { Pencil, Calendar, ChevronDown } from 'lucide-react';

type Props = {
  onSaved: () => void;
  onClose?: () => void;
};

// ================= DATE HELPERS =================
const BULAN_MAP: Record<string, string> = {
  Januari: '01',
  Februari: '02',
  Maret: '03',
  April: '04',
  Mei: '05',
  Juni: '06',
  Juli: '07',
  Agustus: '08',
  September: '09',
  Oktober: '10',
  November: '11',
  Desember: '12',
};

const BULAN_ARR = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// "12 Maret 1989" → "1989-03-12"
function parseTanggalLahir(str: string): string {
  if (!str) return '';
  const parts = str.trim().split(' ');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const month = BULAN_MAP[parts[1]] || '01';
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

// "1989-03-12" → "12 Maret 1989"
function formatTanggalLahir(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const bulan = BULAN_ARR[parseInt(month, 10) - 1] || '';
  return `${parseInt(day, 10)} ${bulan} ${year}`;
}

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
        className="relative shadow-2xl bg-white"
        style={{
          width: '460px',
          height: '250px',
          borderRadius: '12px',
        }}
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
            top: '86px',
            transform: 'translateX(-50%)',
            width: '400px',
            fontSize: '13px',
            lineHeight: '18px',
          }}
        >
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
        </p>

        <button
          type="button"
          onClick={onTetap}
          className="absolute font-semibold transition-colors hover:bg-[#c9c9c9] cursor-pointer bg-[#D9D9D9]"
          style={{
            left: '30px',
            top: '175px',
            width: '190px',
            height: '42px',
            borderRadius: '10px',
            fontSize: '15px',
            lineHeight: '18px',
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
            left: '240px',
            top: '175px',
            width: '190px',
            height: '42px',
            borderRadius: '10px',
            fontSize: '15px',
            lineHeight: '18px',
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
  const dateInputRef = useRef<HTMLInputElement>(null);

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

  // ===== Styles =====
  const inputBase =
    'w-full h-[40px] px-3 rounded-[10px] bg-[#D9D9D9] text-[13px] font-medium text-black/80 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelBase = 'block text-[13px] font-semibold text-black leading-[16px] mb-1.5';
  const sectionTitle = 'text-[13px] font-bold text-[#D45060] leading-[16px] uppercase';

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
        <div className="relative w-full max-w-[720px] my-6 bg-white rounded-[14px] shadow-2xl px-7 pt-6 pb-8">

          {/* ============ TITLE ============ */}
          <h1 className="text-[18px] font-bold text-black leading-[22px] mb-5">
            Profil Kader
          </h1>

          {/* ============ SECTION 1: FOTO & DATA PRIBADI ============ */}
          <h2 className={`${sectionTitle} mb-5`}>Foto &amp; Data Pribadi</h2>

          <div className="flex gap-8">
            {/* Avatar */}
            <div className="shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFotoChange}
                className="hidden"
              />
              <div className="relative w-[100px] h-[100px]">
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

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Ubah foto profil"
                  className="absolute bottom-[1px] right-[1px] w-[28px] h-[28px] rounded-full bg-[#D45060] hover:bg-[#c44454] flex items-center justify-center border-[2px] border-white shadow-md cursor-pointer transition-all active:scale-95"
                >
                  <Pencil className="w-[14px] h-[14px] text-white" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 min-w-0 space-y-5">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
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
                      className={`${inputBase} appearance-none pr-10 cursor-pointer ${errors.jenisKelamin ? 'ring-2 ring-[#D45060]' : ''}`}
                    >
                      <option value="Laki - laki">Laki - laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none"
                      strokeWidth={2.2}
                    />
                  </div>
                </div>
              </div>

              {/* Tanggal Lahir + No.HP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
                <div>
                  <label className={labelBase}>Tanggal Lahir</label>
                  <div className="relative">
                    {/* Visible text field (readonly) — tampilkan format "12 Maret 1989" */}
                    <input
                      type="text"
                      value={tanggalLahir}
                      readOnly
                      placeholder="Pilih tanggal"
                      className={`${inputBase} pr-10 cursor-pointer ${errors.tanggalLahir ? 'ring-2 ring-[#D45060]' : ''}`}
                    />
                    {/* Hidden native date input — overlay di atas, klik untuk buka kalender */}
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={parseTanggalLahir(tanggalLahir)}
                      onChange={(e) => {
                        const formatted = formatTanggalLahir(e.target.value);
                        setTanggalLahir(formatted);
                        if (errors.tanggalLahir) setErrors((p) => ({ ...p, tanggalLahir: false }));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      tabIndex={-1}
                      aria-label="Pilih tanggal lahir"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none"
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
          <h2 className={`${sectionTitle} mt-8 mb-5`}>Data Tugas Posyandu</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
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
          <div className="mt-9 flex items-center justify-end gap-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleBatalClick}
                className="w-[110px] h-[36px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[8px] text-[#8F8F8F] text-[14px] font-medium leading-[18px] transition-colors cursor-pointer"
              >
                Batal
              </button>
            )}
            <button
              type="button"
              onClick={handleSimpan}
              className="w-[110px] h-[36px] bg-[#D45060] hover:bg-[#c44454] rounded-[8px] text-white text-[14px] font-medium leading-[18px] transition-colors cursor-pointer"
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