'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import LengkapiProfilModal from '../../components/LengkapiProfilModal';
import GantiKataSandiTab from '../../components/GantiKataSandiTab';

// ================= TYPES =================
type ProfilKader = {
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noHp: string;
  foto: string;
};

const DEFAULT_PROFIL: ProfilKader = {
  nik: '-',
  jenisKelamin: '-',
  tanggalLahir: '-',
  noHp: '-',
  foto: '',
};

// ================= TOAST COMPONENT =================
function ProfilToast({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed top-[40px] right-[40px] z-[10000] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{ width: '578.37px', height: '153.79px' }}
      role="status"
      aria-live="polite"
    >
      {/* Rectangle 410 — background hijau */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '572.36px',
          height: '153.79px',
          background: '#2E9C52',
          borderRadius: '20.0592px',
        }}
      />

      {/* Rectangle 411 — panel putih */}
      <div
        className="absolute"
        style={{
          left: '10.03px',
          top: 0,
          width: '562.33px',
          height: '153.79px',
          background: '#FFFFFF',
          borderRadius: '20.0592px',
        }}
      />

      {/* healthicons:yes — icon centang */}
      <svg
        className="absolute"
        style={{
          left: '30.76px',
          top: '28.08px',
          width: '44.49px',
          height: '44.49px',
        }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#2E9C52" />
        <path
          d="M6.8 12.5L10.4 16.1L17.2 9.3"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Judul */}
      <h3
        className="absolute font-bold text-black"
        style={{
          left: '90.27px',
          top: '29.42px',
          fontSize: '21.3965px',
          lineHeight: '26px',
        }}
      >
        Profil Berhasil Disimpan
      </h3>

      {/* Deskripsi */}
      <p
        className="absolute"
        style={{
          left: '90.27px',
          top: '62.18px',
          width: '488.11px',
          fontSize: '21.3965px',
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.71)',
        }}
      >
        Profil disimpan sebagai. Anda bisa lanjutkan mengedit kapan saja dari Pengaturan.
      </p>
    </div>
  );
}

// ================= MAIN CONTENT =================
function PengaturanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengkapiParam = searchParams.get('lengkapi');

  const [showLengkapi, setShowLengkapi] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'password'>('profil');
  const [profil, setProfil] = useState<ProfilKader>(DEFAULT_PROFIL);

  // Auto-buka modal kalau ?lengkapi=1
  useEffect(() => {
    if (lengkapiParam === '1') setShowLengkapi(true);
  }, [lengkapiParam]);

  // Baca data profil dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simpasi_profil_kader');
    if (saved) {
      try {
        setProfil({ ...DEFAULT_PROFIL, ...JSON.parse(saved) });
      } catch {
        /* ignore */
      }
    }
  }, [showLengkapi, showEdit]);

  // Auto-dismiss toast setelah 4 detik
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  const handleSavedLengkapi = () => {
    setShowLengkapi(false);
    router.push('/dashboard');
  };

  const handleSavedEdit = () => {
    setShowEdit(false);
    setShowToast(true);
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="pengaturan" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Pengaturan" titleColor="#D45060" />

        <div className="flex-1 overflow-y-auto px-[34px] pt-[34px] pb-8">
          {/* TABS */}
          <div className="w-[560px] h-[60px] bg-[#FEEB96] rounded-[14px] p-[6px] flex mb-[26px]">
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`flex-1 rounded-[10px] font-semibold text-[19px] transition-colors cursor-pointer ${
                activeTab === 'profil' ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6] hover:bg-[#FFE9A8]'
              }`}
            >
              Profil
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              className={`flex-1 rounded-[10px] font-semibold text-[19px] transition-colors cursor-pointer ${
                activeTab === 'password' ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6] hover:bg-[#FFE9A8]'
              }`}
            >
              Ganti Kata Sandi
            </button>
          </div>

          {activeTab === 'profil' && (
            <div className="bg-white rounded-[14px] px-[42px] pt-[36px] pb-[42px] max-w-[1100px]">
              {/* Header */}
              <div className="flex items-start justify-between mb-[30px]">
                <div>
                  <h1 className="text-[32px] font-bold text-black leading-tight">Profil Kader</h1>
                  <p className="mt-[6px] text-[15px] text-[#8F8F8F]">
                    Lihat data diri dan tugas posyandu Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-[10px] h-[52px] px-[24px] bg-[#D45060] hover:bg-[#c44454] text-white font-bold text-[18px] rounded-[12px] transition-colors cursor-pointer"
                >
                  <Pencil className="w-[22px] h-[22px]" strokeWidth={2.2} />
                  <span>Edit Profil</span>
                </button>
              </div>

              {/* Avatar + Nama */}
              <div className="flex items-center gap-[26px] mb-[28px]">
                <div className="w-[130px] h-[130px] rounded-full overflow-hidden bg-white shrink-0">
                  {profil.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profil.foto} alt="Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <circle cx="100" cy="100" r="96" fill="#F2F2F2" stroke="#D9D9D9" strokeWidth="8" />
                      <circle cx="100" cy="78" r="32" fill="#D9D9D9" />
                      <path d="M 40 170 Q 40 120 100 120 Q 160 120 160 170 Z" fill="#D9D9D9" />
                    </svg>
                  )}
                </div>

                <div>
                  <h2 className="text-[28px] font-bold text-black leading-tight">Siti Amaliah</h2>
                  <span className="inline-flex items-center mt-[10px] h-[28px] px-[14px] bg-[#D9D9D9]/70 rounded-full text-[13px] font-bold text-[#5a5a5a]">
                    Kader Aktif
                  </span>
                  <p className="mt-[10px] text-[15px] text-[#8F8F8F]">Bergabung sejak 12 Maret 2022</p>
                </div>
              </div>

              <div className="border-t border-[#D9D9D9] mb-[26px]" />

              {/* DATA PRIBADI */}
              <h3 className="text-[#D45060] font-bold text-[14px] uppercase tracking-wide mb-[20px]">
                Data Pribadi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-[22px] mb-[36px]">
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">NIK</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">{profil.nik}</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Jenis Kelamin</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">{profil.jenisKelamin}</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Tanggal Lahir</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">{profil.tanggalLahir}</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">No.HP/WhatsApp</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">{profil.noHp}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[14px] text-[#8F8F8F]">Email</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">siti.amaliah@gmail.com</p>
                </div>
              </div>

              {/* DATA TUGAS POSYANDU */}
              <h3 className="text-[#D45060] font-bold text-[14px] uppercase tracking-wide mb-[20px]">
                Data Tugas Posyandu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[60px] gap-y-[22px]">
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Nama Posyandu</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">Posyandu Melati III</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Jabatan</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">Kader Gizi</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Wilayah</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">Kel. Lowokwaru, Kota Malang</p>
                </div>
                <div>
                  <p className="text-[14px] text-[#8F8F8F]">Tanggal Bergabung</p>
                  <p className="mt-[6px] text-[16px] font-bold text-black">12 Maret 2022</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="flex justify-center">
              <GantiKataSandiTab />
            </div>
          )}
        </div>
      </main>

      {/* Modal LENGKAPI — mandatory, tanpa Batal, setelah Simpan → dashboard */}
      {showLengkapi && <LengkapiProfilModal onSaved={handleSavedLengkapi} />}

      {/* Modal EDIT — dengan Batal, setelah Simpan → tetap di pengaturan + toast */}
      {showEdit && (
        <LengkapiProfilModal
          onSaved={handleSavedEdit}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* Toast Profil Berhasil Disimpan */}
      {showToast && <ProfilToast onClose={() => setShowToast(false)} />}
    </div>
  );
}

export default function PengaturanPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
      <PengaturanContent />
    </Suspense>
  );
}