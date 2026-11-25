'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircleUserRound, Calendar, ChevronDown } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AuthGuard from '../../components/AuthGuard';
import GantiKataSandiTab from '../../components/GantiKataSandiTab';
import ProfilToast from '../../components/ProfilToast';
import { useProfilFoto, setProfilFoto } from '../../components/profilFoto';
import { api } from '../../lib/api';

// ================= TANGGAL =================
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
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parts = str.trim().split(' ');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const month = BULAN_MAP[parts[1]];
  const year = parts[2];
  if (!month || !/^\d{4}$/.test(year)) return '';
  return `${year}-${month}-${day}`;
}

function formatTanggalLahir(isoDate: string): string {
  if (!isoDate) return '';

  let year = '';
  let month = '';
  let day = '';

  if (isoDate.includes('T')) {
    const t = new Date(isoDate);
    if (Number.isNaN(t.getTime())) return isoDate;
    year = String(t.getFullYear());
    month = String(t.getMonth() + 1);
    day = String(t.getDate());
  } else {
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    [year, month, day] = parts;
  }

  const bulan = BULAN_ARR[parseInt(month, 10) - 1] || '';
  return `${parseInt(day, 10)} ${bulan} ${year}`;
}

const hariIniIso = (): string => {
  const t = new Date();
  const mm = String(t.getMonth() + 1).padStart(2, '0');
  const dd = String(t.getDate()).padStart(2, '0');
  return `${t.getFullYear()}-${mm}-${dd}`;
};

const pick = (o: any, ...keys: string[]): any => {
  for (const k of keys) {
    const v = o?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
};

function BatalKonfirmasiModal({
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
            top: '78px',
            transform: 'translateX(-50%)',
            width: '420px',
            fontSize: '13px',
            lineHeight: '19px',
          }}
        >
          Perubahan yang belum disimpan akan hilang.<br />
          Yakin ingin membatalkan?
        </p>

        <button
          type="button"
          onClick={onTetap}
          className="absolute font-semibold transition-colors bg-white hover:bg-[#c9c9c9] text-[#797777] cursor-pointer"
          style={{
            left: '35px',
            top: '175px',
            width: '195px',
            height: '44px',
            borderRadius: '10px',
            fontSize: '16px',
            lineHeight: '20px',
            border: '1px solid #AAA6A6',
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

// ================= MAIN CONTENT =================
function PengaturanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengkapiParam = searchParams.get('lengkapi');
  const modeParam = searchParams.get('mode');
  const isEditMode = modeParam === 'edit';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'password'>('profil');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  // State Form Profil
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [noHp, setNoHp] = useState('');

  // State Readonly Tugas Posyandu
  const [namaPosyandu, setNamaPosyandu] = useState('-');
  const [jabatan, setJabatan] = useState('-');
  const [wilayah, setWilayah] = useState('-');
  const [tanggalBergabung, setTanggalBergabung] = useState('-');

  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>('');

  // Foto profil reaktif
  const fotoProfil = useProfilFoto();

  // Ambil profil dari backend (dipakai saat halaman dibuka dan setelah simpan)
  const loadProfile = async () => {
    try {
      const result = await api<any>('/kader/profile');
      const d = result?.data ?? result;
      if (!d) return;

      setNama(String(pick(d, 'full_name', 'fullName')));
      setEmail(String(pick(d, 'email')));
      setNik(String(pick(d, 'nik')));
      setJenisKelamin(pick(d, 'gender') === 'L' ? 'Laki - laki' : 'Perempuan');

      const lahir = String(pick(d, 'birth_date', 'birthDate'));
      setTanggalLahir(lahir ? formatTanggalLahir(lahir) : '');

      setNoHp(String(pick(d, 'phone')));
      setNamaPosyandu(String(pick(d, 'posyandu_name', 'posyanduName')) || '-');
      setJabatan(String(pick(d, 'position', 'role')) || 'Kader Gizi');
      setWilayah(String(pick(d, 'region')) || '-');

      const dibuat = String(pick(d, 'joined_at', 'joinedAt', 'created_at', 'createdAt'));
      setTanggalBergabung(
        dibuat
          ? new Date(dibuat).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : '-'
      );

      const foto = String(pick(d, 'photo_url', 'photoUrl'));
      setFotoPreview(foto);
      setExistingPhotoUrl(foto);

      // TAMBAHKAN INI: Sinkronkan foto dari database ke Topbar via localStorage
      if (foto) {
        setProfilFoto(foto);
      } else {
        setProfilFoto('');
      }
    } catch (error) {
      console.error('Gagal memuat profil pengaturan:', error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (lengkapiParam === '1') {
      router.replace('/pengaturan?mode=edit');
    }
  }, [lengkapiParam, router]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      input.value = '';
      return;
    }
    setSelectedFile(file);
    setFotoPreview(URL.createObjectURL(file));
    // reset supaya file yang sama bisa dipilih ulang
    input.value = '';
  };

  // Tampilkan pesan error dan gulir ke atas supaya terlihat
  const tampilkanError = (pesan: string) => {
    setErrorMessage(pesan);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validasi di sisi web (aturan sama dengan backend)
  const validasiForm = (): string => {
    if (!nama.trim()) return 'Nama lengkap wajib diisi.';
    if (!/^\d{16}$/.test(nik)) return 'NIK harus berupa 16 digit angka.';
    if (!parseTanggalLahir(tanggalLahir)) return 'Tanggal lahir wajib diisi.';
    if (parseTanggalLahir(tanggalLahir) > hariIniIso()) return 'Tanggal lahir tidak boleh di masa depan.';
    if (noHp.length < 10 || noHp.length > 15) return 'Nomor HP harus terdiri dari 10 hingga 15 digit.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Format email tidak valid.';
    return '';
  };

  const handleSimpan = async () => {
    if (isSaving) return;

    const pesan = validasiForm();
    if (pesan) {
      tampilkanError(pesan);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      let finalPhotoUrl = existingPhotoUrl;

      // Foto baru: unggah lewat api() supaya token terbaca (localStorage maupun sessionStorage)
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadRes = await api<any>('/uploads/profile-photo', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes?.success || !uploadRes?.data?.url) {
          throw new Error(uploadRes?.message || 'Gagal mengunggah foto.');
        }
        finalPhotoUrl = uploadRes.data.url as string;
      }

      await api('/kader/profile', {
        method: 'PUT',
        body: {
          fullName: nama.trim(),
          email: email.trim(),
          nik,
          gender: jenisKelamin === 'Laki - laki' ? 'L' : 'P',
          birthDate: parseTanggalLahir(tanggalLahir),
          phone: noHp,
          photoUrl: finalPhotoUrl || null,
        },
      });

      //  TAMBAHKAN INI: Sinkronkan foto baru ke Topbar via localStorage 
      if (finalPhotoUrl) {
        setProfilFoto(finalPhotoUrl);
      } else {
        setProfilFoto('');
      }

      setSelectedFile(null);
      await loadProfile();
      setShowToast(true);
      router.push('/pengaturan');
    } catch (error: any) {
      tampilkanError(error?.message || 'Gagal menyimpan perubahan profil.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputBase = 'w-full h-[40px] px-3 rounded-[10px] bg-[#D9D9D9] text-[13px] font-medium text-black/80 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelBase = 'block text-[13px] font-semibold text-black leading-[16px] mb-1.5';
  const sectionTitle = 'text-[13px] font-bold text-[#D45060] leading-[16px] uppercase tracking-wide mb-4';

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar
        activePage="pengaturan"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar
          title="Pengaturan"
          titleColor="#D45060"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-6">

          {/* Tab kuning */}
          <div className="w-full max-w-[360px] h-[48px] sm:h-[52px] bg-[#FEEB96] rounded-[12px] p-[5px] sm:p-[6px] flex mb-4 sm:mb-5">
            {(['profil', 'password'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-[10px] font-semibold text-[13px] sm:text-[15px] leading-[16px] sm:leading-[18px] transition-colors cursor-pointer ${
                  activeTab === tab ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6]/80 hover:bg-[#FFE9A8]'
                }`}
              >
                {tab === 'profil' ? 'Profil' : 'Ganti Kata Sandi'}
              </button>
            ))}
          </div>

          {activeTab === 'profil' && (
            <div className="max-w-[720px] mx-auto bg-white rounded-[14px] border border-[#AAA6A6]/70 px-4 sm:px-6 lg:px-7 pt-5 sm:pt-6 pb-6 sm:pb-7">

              {/* ============ HEADER ============ */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-5 sm:mb-6">
                <div>
                  <h1 className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">
                    {isEditMode ? 'Edit Profil Kader' : 'Profil Kader'}
                  </h1>
                  <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] font-bold text-black/50 leading-[15px] sm:leading-[16px]">
                    {isEditMode ? 'Perbarui data diri dan tugas posyandu Anda' : 'Lihat data diri dan tugas posyandu Anda'}
                  </p>
                </div>
                {!isEditMode && (
                  <button
                    type="button"
                    onClick={() => router.push('/pengaturan?mode=edit')}
                    className="flex items-center justify-center gap-2 h-[36px] sm:h-[38px] px-3.5 sm:px-4 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] text-white font-semibold text-[13px] sm:text-[14px] rounded-[10px] transition-all duration-150 cursor-pointer self-start sm:self-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    <span>Edit Profil</span>
                  </button>
                )}
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-[13px] rounded-lg">
                  {errorMessage}
                </div>
              )}

              {/* ============ AVATAR + NAMA ============ */}
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-7">
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFotoChange} className="hidden" />
                
                {/* Wrapper luar: TANPA overflow-hidden agar tombol pensil tidak terpotong */}
                <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] shrink-0 relative">
                  <button
                    type="button"
                    disabled={!isEditMode}
                    onClick={() => isEditMode && fileInputRef.current?.click()}
                    className={`w-full h-full rounded-full overflow-hidden bg-[#D9D9D9] relative block ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <CircleUserRound className="absolute inset-0 w-full h-full text-black/70" strokeWidth={1} />
                    {(fotoPreview || fotoProfil) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={fotoPreview || fotoProfil}
                        src={fotoPreview || fotoProfil}
                        alt="Foto Profil"
                        className="relative w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </button>

                  {isEditMode && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full bg-[#D45060] hover:bg-[#c44454] flex items-center justify-center border-2 border-white shadow-md z-10 cursor-pointer transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                        <path d="M3.995 17.207V19.5a.5.5 0 0 0 .5.5h2.298a.5.5 0 0 0 .353-.146l9.448-9.448l-3-3l-9.452 9.448a.5.5 0 0 0-.147.353m10.837-11.04l3 3l1.46-1.46a1 1 0 0 0 0-1.414l-1.585-1.586a1 1 0 0 0-1.414 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-[17px] sm:text-[19px] lg:text-[20px] font-semibold text-black leading-[22px] sm:leading-[26px] truncate">
                    {nama || 'Siti Amaliah'}
                  </h2>
                  <span className="inline-flex items-center mt-1.5 sm:mt-2 h-[24px] sm:h-[26px] px-2.5 sm:px-3 bg-[#D9D9D9]/70 rounded-[10px] text-[11px] sm:text-[12px] font-bold text-[#1A7772] leading-[13px] sm:leading-[14px]">
                    Kader Aktif
                  </span>
                  <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] font-medium text-black/50 leading-[15px] sm:leading-[16px]">
                    Bergabung sejak {tanggalBergabung}
                  </p>
                </div>
              </div>

              <div className="border-t border-black/50 mb-5" />

              {/* ============ DATA PRIBADI ============ */}
              <h3 className={sectionTitle}>Data Pribadi</h3>
              <div className="space-y-4 mb-6 sm:mb-8">
                <div>
                  <label className={labelBase}>Nama Lengkap</label>
                  <input type="text" value={nama} onChange={(e) => isEditMode && setNama(e.target.value)} readOnly={!isEditMode} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>NIK {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                    <input type="text" value={nik} readOnly={!isEditMode} onChange={(e) => isEditMode && setNik(e.target.value.replace(/\D/g, '').slice(0, 16))} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                  </div>
                  <div>
                    <label className={labelBase}>Jenis Kelamin {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                    <div className="relative">
                      <select value={jenisKelamin} disabled={!isEditMode} onChange={(e) => setJenisKelamin(e.target.value)} className={`${inputBase} appearance-none pr-10 ${!isEditMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
                        <option value="Laki - laki">Laki - laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      {isEditMode && <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelBase}>Tanggal Lahir {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                    <div className="relative">
                      <input type="text" value={tanggalLahir} readOnly className={`${inputBase} pr-10 ${!isEditMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`} />
                      {isEditMode && (
                        <input
                          type="date"
                          max={hariIniIso()}
                          value={parseTanggalLahir(tanggalLahir)}
                          onChange={(e) => setTanggalLahir(formatTanggalLahir(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      )}
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelBase}>No.HP/WhatsApp {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                    <input type="text" value={noHp} readOnly={!isEditMode} onChange={(e) => isEditMode && setNoHp(e.target.value.replace(/\D/g, '').slice(0, 15))} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Email</label>
                  <input type="email" value={email} onChange={(e) => isEditMode && setEmail(e.target.value)} readOnly={!isEditMode} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                </div>
              </div>

              {/* ============ DATA TUGAS POSYANDU ============ */}
              <h3 className={sectionTitle}>Data Tugas Posyandu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={labelBase}>Nama Posyandu</label><input type="text" value={namaPosyandu} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Jabatan</label><input type="text" value={jabatan} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Wilayah</label><input type="text" value={wilayah} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Tanggal Bergabung</label><input type="text" value={tanggalBergabung} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
              </div>

              {/* Tombol Aksi di Mode Edit */}
              {isEditMode && (
                <div className="mt-8 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setShowBatalConfirm(true)} disabled={isSaving} className="w-[110px] h-[36px] hover:bg-[#c9c9c9] rounded-[8px] text-[#8F8F8F] text-[14px] font-medium cursor-pointer border border-[#8F8F8F]/50">
                    Batal
                  </button>
                  <button type="button" onClick={handleSimpan} disabled={isSaving} className="w-[110px] h-[36px] bg-[#D45060] rounded-[8px] text-white text-[14px] font-medium cursor-pointer disabled:opacity-50">
                    {isSaving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-[720px] mx-auto flex justify-center">
              <GantiKataSandiTab />
            </div>
          )}
        </div>
      </main>

      {showBatalConfirm && (
        <BatalKonfirmasiModal
          onTetap={() => setShowBatalConfirm(false)}
          onBatalkan={() => {
            setShowBatalConfirm(false);
            setSelectedFile(null);
            setErrorMessage('');
            loadProfile();
            router.push('/pengaturan');
          }}
        />
      )}
      {showToast && <ProfilToast onClose={() => setShowToast(false)} />}
    </div>
  );
}

// ================= EXPORT: dibungkus penjaga login =================
export default function PengaturanPage() {
  return (
    <AuthGuard role="kader">
      <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
        <PengaturanContent />
      </Suspense>
    </AuthGuard>
  );
}