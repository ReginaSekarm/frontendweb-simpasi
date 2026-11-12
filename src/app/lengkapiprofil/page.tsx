'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown, CircleUserRound } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import PageTransition from '../../components/PageTransition';

function IconEditProfil({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M3.995 17.207V19.5a.5.5 0 0 0 .5.5h2.298a.5.5 0 0 0 .353-.146l9.448-9.448l-3-3l-9.452 9.448a.5.5 0 0 0-.147.353m10.837-11.04l3 3l1.46-1.46a1 1 0 0 0 0-1.414l-1.585-1.586a1 1 0 0 0-1.414 0z" />
    </svg>
  );
}

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
  if (str.includes('-')) return str; 
  const parts = str.trim().split(' ');
  if (parts.length !== 3) return '';
  const day = parts[0].padStart(2, '0');
  const month = BULAN_MAP[parts[1]] || '01';
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

function formatTanggalLahir(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const bulan = BULAN_ARR[parseInt(month, 10) - 1] || '';
  return `${parseInt(day, 10)} ${bulan} ${year}`;
}

function BatalKonfirmasiModal({ onTetap, onBatalkan }: { onTetap: () => void; onBatalkan: () => void }) {
  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4">
      <div className="relative shadow-2xl bg-white" style={{ width: '460px', height: '250px', borderRadius: '12px' }}>
        <h2 className="absolute font-semibold text-black text-center" style={{ left: '50%', top: '42px', transform: 'translateX(-50%)', width: '400px', fontSize: '20px', lineHeight: '26px' }}>
          Batalkan Perubahan?
        </h2>
        <p className="absolute text-black text-center" style={{ left: '50%', top: '86px', transform: 'translateX(-50%)', width: '400px', fontSize: '13px', lineHeight: '18px' }}>
          Perubahan yang belum disimpan akan hilang. Yakin ingin membatalkan?
        </p>
        <button type="button" onClick={onTetap} className="absolute font-semibold transition-colors hover:bg-[#c9c9c9] cursor-pointer bg-[#D9D9D9]" style={{ left: '30px', top: '175px', width: '190px', height: '42px', borderRadius: '10px', fontSize: '15px', color: 'rgba(121, 119, 119, 0.8)' }}>
          Tetap di sini
        </button>
        <button type="button" onClick={onBatalkan} className="absolute font-semibold text-white transition-colors hover:bg-[#e0001c] cursor-pointer bg-[#FF0020]" style={{ left: '240px', top: '175px', width: '190px', height: '42px', borderRadius: '10px', fontSize: '15px' }}>
          Ya, Batalkan
        </button>
      </div>
    </div>
  );
}

function ProfilContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const isEditMode = mode === 'edit';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Perempuan');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [noHp, setNoHp] = useState('');

  const [namaPosyandu, setNamaPosyandu] = useState('-');
  const [jabatan, setJabatan] = useState('-');
  const [wilayah, setWilayah] = useState('-');
  const [tanggalBergabung, setTanggalBergabung] = useState('-');

  const [fotoPreview, setFotoPreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showBatalConfirm, setShowBatalConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/kader/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json();

        if (response.ok && result.success) {
          const d = result.data;
          setNama(d.full_name || '');
          setEmail(d.email || '');
          setNik(d.nik || '');
          setJenisKelamin(d.gender === 'L' ? 'Laki - laki' : 'Perempuan');
          setTanggalLahir(d.birth_date ? formatTanggalLahir(d.birth_date) : '');
          setNoHp(d.phone || '');
          setNamaPosyandu(d.posyandu_name || '-');
          setJabatan(d.role || 'Kader');
          setWilayah(d.region || '-');
          setTanggalBergabung(d.created_at ? new Date(d.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-');
          setFotoPreview(d.photo_url || '');
        } else {
          setErrorMessage(result.message || 'Gagal memuat profil.');
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Gagal terhubung ke server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const inputBase = 'w-full h-[40px] px-3 rounded-[10px] bg-[#D9D9D9] text-[13px] font-medium text-black/80 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[#D45060]/40 transition';
  const labelBase = 'block text-[13px] font-semibold text-black leading-[16px] mb-1.5';
  const sectionTitle = 'text-[13px] font-bold text-[#D45060] leading-[16px] uppercase tracking-wide';

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }
    setSelectedFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleHapusFoto = () => {
    setFotoPreview('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSimpan = async () => {
    const errs: Record<string, boolean> = {};
    if (!nik.trim()) errs.nik = true;
    if (!jenisKelamin) errs.jenisKelamin = true;
    if (!tanggalLahir.trim()) errs.tanggalLahir = true;
    if (!noHp.trim()) errs.noHp = true;

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      let finalPhotoUrl = fotoPreview;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);

        const uploadRes = await fetch('http://localhost:5000/api/uploads/profile-photo', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadResult.message || 'Gagal mengunggah foto.');
        finalPhotoUrl = uploadResult.url || uploadResult.photoUrl;
      }

      const dbGender = jenisKelamin === 'Laki - laki' ? 'L' : 'P';
      const dbBirthDate = parseTanggalLahir(tanggalLahir);

      const response = await fetch('http://localhost:5000/api/kader/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: nama,
          email: email,
          nik: nik,
          gender: dbGender,
          birthDate: dbBirthDate,
          phone: noHp,
          photoUrl: finalPhotoUrl || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal memperbarui profil.');

      // Setelah berhasil simpan profil, arahkan ke dashboard
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#B3EAE8] flex items-center justify-center font-['Inter',sans-serif]">
        <p className="text-[16px] font-semibold text-black/70 animate-pulse">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="profil" isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar title="Profil Kader" titleColor="#D45060" hideSearch hideNotif onMenuClick={() => setSidebarOpen(true)} />
        <PageTransition>
          <div className="flex-1 h-full overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-10 sm:pb-14">
            <div className="mb-4 sm:mb-5">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-black leading-tight">
                {isEditMode ? 'Edit Profil Kader' : 'Profil Kader'}
              </h1>
            </div>

            {errorMessage && (
              <div className="max-w-[720px] mx-auto mb-4 p-3 bg-red-100 border border-red-300 text-red-700 text-[13px] rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="max-w-[720px] mx-auto bg-white rounded-[14px] border border-[#AAA6A6]/70 px-4 sm:px-6 lg:px-7 pt-5 sm:pt-6 pb-7 sm:pb-8">
              <h2 className={`${sectionTitle} mb-4 sm:mb-5`}>Foto &amp; Data Pribadi</h2>

              <div className="flex flex-col md:flex-row gap-5 sm:gap-6 lg:gap-8">
                <div className="shrink-0 flex flex-col items-center md:items-start gap-2">
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" onChange={handleFotoChange} className="hidden" />
                  <div className="relative w-[100px] h-[100px]">
                    <button type="button" disabled={!isEditMode} onClick={() => isEditMode && fileInputRef.current?.click()} className={`w-full h-full rounded-full overflow-hidden bg-[#D9D9D9] relative ${isEditMode ? 'cursor-pointer' : 'cursor-default'}`}>
                      {fotoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <CircleUserRound className="w-full h-full text-black/70" strokeWidth={1} />
                      )}
                    </button>
                    {isEditMode && (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-[1px] right-[1px] w-[28px] h-[28px] rounded-full bg-[#D45060] flex items-center justify-center border-[2px] border-white shadow-md cursor-pointer">
                        <IconEditProfil className="w-[16px] h-[16px] text-white" />
                      </button>
                    )}
                  </div>
                  {isEditMode && fotoPreview && (
                    <button type="button" onClick={handleHapusFoto} className="text-[11px] font-semibold text-[#D45060] hover:text-[#c44454] cursor-pointer">
                      Hapus foto
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-4 sm:space-y-5">
                  <div>
                    <label className={labelBase}>Nama Lengkap</label>
                    <input type="text" value={nama} onChange={(e) => isEditMode && setNama(e.target.value)} readOnly={!isEditMode} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
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
                        {isEditMode && <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" />}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
                    <div>
                      <label className={labelBase}>Tanggal Lahir {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                      <div className="relative">
                        <input type="text" value={tanggalLahir} readOnly className={`${inputBase} pr-10 ${!isEditMode ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`} />
                        {isEditMode && (
                          <input type="date" value={parseTanggalLahir(tanggalLahir)} onChange={(e) => setTanggalLahir(formatTanggalLahir(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        )}
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-black pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelBase}>No.HP/Whatsapp {isEditMode && <span className="text-[#D45060]">*</span>}</label>
                      <input type="text" value={noHp} readOnly={!isEditMode} onChange={(e) => isEditMode && setNoHp(e.target.value.replace(/\D/g, ''))} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Email</label>
                    <input type="email" value={email} onChange={(e) => isEditMode && setEmail(e.target.value)} readOnly={!isEditMode} className={`${inputBase} ${!isEditMode ? 'cursor-not-allowed opacity-80' : ''}`} />
                  </div>
                </div>
              </div>

              <h2 className={`${sectionTitle} mt-6 sm:mt-8 mb-4 sm:mb-5`}>Data Tugas Posyandu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                <div><label className={labelBase}>Nama Posyandu</label><input type="text" value={namaPosyandu} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Jabatan</label><input type="text" value={jabatan} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Wilayah</label><input type="text" value={wilayah} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
                <div><label className={labelBase}>Tanggal Bergabung</label><input type="text" value={tanggalBergabung} readOnly className={`${inputBase} cursor-not-allowed opacity-80`} /></div>
              </div>

              <div className="mt-7 sm:mt-9 flex items-center justify-end gap-3">
                {isEditMode ? (
                  <>
                    <button type="button" onClick={() => setShowBatalConfirm(true)} disabled={isSaving} className="w-[110px] h-[36px] bg-[#D9D9D9] rounded-[8px] text-[#8F8F8F] text-[14px] font-medium cursor-pointer">Batal</button>
                    <button type="button" onClick={handleSimpan} disabled={isSaving} className="w-[110px] h-[36px] bg-[#D45060] rounded-[8px] text-white text-[14px] font-medium cursor-pointer disabled:opacity-50">
                      {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </>
                ) : (
                  <button type="button" onClick={() => router.push('/profil?mode=edit')} className="w-[130px] h-[36px] bg-[#D45060] rounded-[8px] text-white text-[14px] font-medium cursor-pointer flex items-center justify-center">
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
      {showBatalConfirm && <BatalKonfirmasiModal onTetap={() => setShowBatalConfirm(false)} onBatalkan={() => { setShowBatalConfirm(false); router.back(); }} />}
    </div>
  );
}

export default function ProfilPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
      <ProfilContent />
    </Suspense>
  );
}