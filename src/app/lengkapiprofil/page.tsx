'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, CircleUserRound } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import PageTransition from '../../components/PageTransition';
import { useProfilFoto, setProfilFoto, fileToDataUrl } from '../../components/profilFoto';

// ================= ICON EDIT PROFIL (dari file edit-profil.svg) =================
// Warna mengikuti `currentColor`, jadi diatur lewat class text-*
function IconEditProfil({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M3.995 17.207V19.5a.5.5 0 0 0 .5.5h2.298a.5.5 0 0 0 .353-.146l9.448-9.448l-3-3l-9.452 9.448a.5.5 0 0 0-.147.353m10.837-11.04l3 3l1.46-1.46a1 1 0 0 0 0-1.414l-1.585-1.586a1 1 0 0 0-1.414 0z"
      />
    </svg>
  );
}

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

function parseTanggalLahir(str: string): string {
  if (!str) return '';
  const parts = str.trim().split(' ');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const month = BULAN_MAP[parts[1]] || '01';
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

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
        style={{ width: '460px', height: '250px', borderRadius: '12px' }}
      >
        <h2
          className="absolute font-semibold text-black text-center"
          style={{
            left: '50%', top: '42px', transform: 'translateX(-50%)',
            width: '400px', fontSize: '20px', lineHeight: '26px',
          }}
        >
          Batalkan Perubahan?
        </h2>

        <p
          className="absolute text-black text-center"
          style={{
            left: '50%', top: '86px', transform: 'translateX(-50%)',
            width: '400px', fontSize: '13px', lineHeight: '18px',
          }}
        >
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
        </p>

        <button
          type="button"
          onClick={onTetap}
          className="absolute font-semibold transition-colors hover:bg-[#c9c9c9] cursor-pointer bg-[#D9D9D9]"
          style={{
            left: '30px', top: '175px', width: '190px', height: '42px',
            borderRadius: '10px', fontSize: '15px', lineHeight: '18px',
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
            left: '240px', top: '175px', width: '190px', height: '42px',
            borderRadius: '10px', fontSize: '15px', lineHeight: '18px',
          }}
        >
          Ya, Batalkan
        </button>
      </div>
    </div>
  );
}

// ================= MAIN CONTENT =================
function ProfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const isEditMode = mode === 'edit';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Readonly
  const nama = 'Siti Amaliah';
  const email = 'siti.amaliah@gmail.com';
  const namaPosyandu = 'Posyandu Melati III';
  const jabatan = 'Kader Gizi';
  const wilayah = 'Kel. Lowokwaru, Kota Malang';
  const tanggalBergabung = '12 Maret 2022';

  // FOTO
  const fotoTersimpan = useProfilFoto();
  const [fotoPreview, setFotoPreview] = useState<string>('');

  useEffect(() => {
    setFotoPreview(fotoTersimpan || '');
  }, [fotoTersimpan]);

  const [nik, setNik] = useState('3578011203890004');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [tanggalLahir, setTanggalLahir] = useState('12 Maret 1989');
  const [noHp, setNoHp] = useState('0812-3456-7890');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // State konfirmasi batal
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const inputBase =
    'w-full h-[40px] px-3 rounded-[10px] bg-[#D9D9D9] text-[13px] font-medium text-black/80 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelBase = 'block text-[13px] font-semibold text-black leading-[16px] mb-1.5';
  const sectionTitle = 'text-[13px] font-bold text-[#D45060] leading-[16px] uppercase tracking-wide';

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maks 2MB');
      return;
    }
    setFotoPreview(await fileToDataUrl(file));
  };

  const handleHapusFoto = () => {
    setFotoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSimpan = () => {
    const errs: Record<string, boolean> = {};
    if (!nik.trim()) errs.nik = true;
    if (!jenisKelamin) errs.jenisKelamin = true;
    if (!tanggalLahir.trim()) errs.tanggalLahir = true;
    if (!noHp.trim()) errs.noHp = true;
    // FOTO SENGAJA TIDAK DIPAKSA — OPSIONAL

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setProfilFoto(fotoPreview || '');
    router.push('/pengaturan');
  };

  // Handler batal
  const handleBatalClick = () => setShowBatalConfirm(true);
  const handleKonfirmasiBatal = () => {
    setShowBatalConfirm(false);
    router.back();  // kembali ke halaman sebelumnya
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar
        activePage="profil"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar
          title="Profil Kader"
          titleColor="#D45060"
          hideSearch
          hideNotif
          onMenuClick={() => setSidebarOpen(true)}
        />

        <PageTransition>
          <div className="flex-1 h-full overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-10 sm:pb-14">

            {/* HEADER DINAMIS */}
            <div className="mb-4 sm:mb-5">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-black leading-tight">
                {isEditMode ? 'Edit Profil Kader' : 'Lengkapi Profil Kader'}
              </h1>
              <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[15px] text-black/60">
                {isEditMode
                  ? 'Ubah data diri dan data tugas posyandu Anda.'
                  : 'Lengkapi data di bawah ini untuk melanjutkan ke dashboard.'}
              </p>
            </div>

            {/* CARD FORM */}
            <div className="max-w-[720px] mx-auto bg-white rounded-[14px] border border-[#AAA6A6]/70 px-4 sm:px-6 lg:px-7 pt-5 sm:pt-6 pb-7 sm:pb-8">

              <h2 className={`${sectionTitle} mb-4 sm:mb-5`}>Foto &amp; Data Pribadi</h2>

              <div className="flex flex-col md:flex-row gap-5 sm:gap-6 lg:gap-8">
                {/* Avatar */}
                <div className="shrink-0 flex flex-col items-center md:items-start gap-2">
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
                      className="w-full h-full rounded-full overflow-hidden bg-[#D9D9D9] cursor-pointer relative"
                      aria-label="Unggah foto profil"
                    >
                      {fotoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <CircleUserRound className="w-full h-full text-black/70" strokeWidth={1} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Ubah foto profil"
                      className="absolute bottom-[1px] right-[1px] w-[28px] h-[28px] rounded-full bg-[#D45060] hover:bg-[#c44454] flex items-center justify-center border-[2px] border-white shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      {/* 👇 Ikon dari file edit-profil.svg */}
                      <IconEditProfil className="w-[16px] h-[16px] text-white" />
                    </button>
                  </div>

                  <div className="flex flex-col items-center md:items-start gap-1">
                    <span className="text-[11px] text-black/40">(opsional)</span>
                    {fotoPreview && (
                      <button
                        type="button"
                        onClick={handleHapusFoto}
                        className="text-[11px] font-semibold text-[#D45060] hover:text-[#c44454] cursor-pointer"
                      >
                        Hapus foto
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
                  <div>
                    <label className={labelBase}>Nama Lengkap</label>
                    <input type="text" value={nama} readOnly className={`${inputBase} cursor-not-allowed`} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
                    <div>
                      <label className={labelBase}>
                        NIK <span className="text-[#D45060]">*</span>
                      </label>
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
                      <label className={labelBase}>
                        Jenis Kelamin <span className="text-[#D45060]">*</span>
                      </label>
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
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" strokeWidth={2.2} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
                    <div>
                      <label className={labelBase}>
                        Tanggal Lahir <span className="text-[#D45060]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={tanggalLahir}
                          readOnly
                          placeholder="Pilih tanggal"
                          className={`${inputBase} pr-10 cursor-pointer ${errors.tanggalLahir ? 'ring-2 ring-[#D45060]' : ''}`}
                        />
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
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" strokeWidth={2} />
                      </div>
                    </div>
                    <div>
                      <label className={labelBase}>
                        No.HP/Whatsapp <span className="text-[#D45060]">*</span>
                      </label>
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

                  <div>
                    <label className={labelBase}>Email</label>
                    <input type="email" value={email} readOnly className={`${inputBase} cursor-not-allowed`} />
                  </div>
                </div>
              </div>

              <h2 className={`${sectionTitle} mt-6 sm:mt-8 mb-4 sm:mb-5`}>Data Tugas Posyandu</h2>

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

              {/* ACTION BUTTONS */}
              <div className="mt-7 sm:mt-9 flex items-center justify-end gap-3">
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
        </PageTransition>
      </main>

      {/* Modal Konfirmasi Batal */}
      {showBatalConfirm && (
        <BatalKonfirmasiModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={handleKonfirmasiBatal}
        />
      )}
    </div>
  );
}

// ================= DEFAULT EXPORT =================
export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
      <ProfilContent />
    </Suspense>
  );
}