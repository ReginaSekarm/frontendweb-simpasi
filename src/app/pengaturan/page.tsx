'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil, CircleUserRound } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import GantiKataSandiTab from '../../components/GantiKataSandiTab';
import ProfilToast from '../../components/ProfilToast';
import { useProfilFoto } from '../../components/profilFoto';

// ================= TYPES =================
type ProfilKader = {
  nik: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noHp: string;
  foto: string;
};

// ================= DUMMY DATA =================
const DUMMY_PROFIL: ProfilKader = {
  nik: '3578011203890004',
  jenisKelamin: 'Perempuan',
  tanggalLahir: '12 Maret 1989',
  noHp: '0812-3456-7890',
  foto: '',
};

const DATA_PRIBADI = [
  { label: 'NIK', value: '3578011203890004' },
  { label: 'Jenis Kelamin', value: 'Perempuan' },
  { label: 'Tanggal Lahir', value: '12 Maret 1989' },
  { label: 'No.HP/WhatsApp', value: '0812-3456-7890' },
  { label: 'Email', value: 'siti.amaliah@gmail.com', span: 2 },
];

const DATA_TUGAS = [
  { label: 'Nama Posyandu', value: 'Posyandu Melati III' },
  { label: 'Jabatan', value: 'Kader Gizi' },
  { label: 'Wilayah', value: 'Kel. Lowokwaru, Kota Malang' },
  { label: 'Tanggal Bergabung', value: '12 Maret 2022' },
];

// ================= MAIN CONTENT =================
function PengaturanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lengkapiParam = searchParams.get('lengkapi');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'password'>('profil');
  const [profil] = useState<ProfilKader>(DUMMY_PROFIL);

  // ⭐ FOTO PROFIL REAKTIF — sinkron dengan Topbar & halaman /lengkapiprofil
  const fotoProfil = useProfilFoto();

  // Kalau ada ?lengkapi=1 → langsung pindah ke halaman /lengkapiprofil (mode lengkapi)
  useEffect(() => {
    if (lengkapiParam === '1') {
      router.replace('/lengkapiprofil');
    }
  }, [lengkapiParam, router]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  // Tutup drawer saat resize ke desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
          titleColor="#000000"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-6">

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
                  <h1 className="text-[18px] sm:text-[20px] font-bold text-black leading-tight">Profil Kader</h1>
                  <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] font-bold text-black/50 leading-[15px] sm:leading-[16px]">
                    Lihat data diri dan tugas posyandu Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push('/lengkapiprofil?mode=edit')}
                  className="flex items-center justify-center gap-2 h-[36px] sm:h-[38px] px-3.5 sm:px-4 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none text-white font-semibold text-[13px] sm:text-[14px] rounded-[10px] transition-all duration-150 cursor-pointer self-start sm:self-auto"
                >
                  <Pencil className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
                  <span>Edit Profil</span>
                </button>
              </div>

              {/* ============ AVATAR + NAMA ============ */}
              <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-7">
                <div className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] rounded-full overflow-hidden bg-[#D9D9D9] shrink-0 relative">
                  {/* ⭐ Icon default di belakang */}
                  <CircleUserRound className="absolute inset-0 w-full h-full text-black/70" strokeWidth={1} />
                  {/* ⭐ Foto dari useProfilFoto() kalau ada */}
                  {fotoProfil && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={fotoProfil}
                      src={fotoProfil}
                      alt="Foto Profil"
                      className="relative w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-[17px] sm:text-[19px] lg:text-[20px] font-semibold text-black leading-[22px] sm:leading-[26px] truncate">
                    Siti Amaliah
                  </h2>
                  <span className="inline-flex items-center mt-1.5 sm:mt-2 h-[24px] sm:h-[26px] px-2.5 sm:px-3 bg-[#D9D9D9]/70 rounded-[10px] text-[11px] sm:text-[12px] font-bold text-[#1A7772] leading-[13px] sm:leading-[14px]">
                    Kader Aktif
                  </span>
                  <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] font-medium text-black/50 leading-[15px] sm:leading-[16px]">
                    Bergabung sejak 12 Maret 2022
                  </p>
                </div>
              </div>

              <div className="border-t border-black/50 mb-5" />

              {/* ============ DATA PRIBADI ============ */}
              <SectionTitle>Data Pribadi</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 sm:gap-y-5 mb-6 sm:mb-8">
                {DATA_PRIBADI.map((item) => (
                  <DataItem key={item.label} label={item.label} value={item.value} span={item.span} />
                ))}
              </div>

              {/* ============ DATA TUGAS POSYANDU ============ */}
              <SectionTitle>Data Tugas Posyandu</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 sm:gap-y-5">
                {DATA_TUGAS.map((item) => (
                  <DataItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-[720px] mx-auto flex justify-center">
              <GantiKataSandiTab />
            </div>
          )}
        </div>
      </main>

      {showToast && <ProfilToast onClose={() => setShowToast(false)} />}
    </div>
  );
}

// ================= SUB-COMPONENTS =================
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[#D45060] font-bold text-[13px] uppercase tracking-wide mb-4 leading-[16px]">
      {children}
    </h3>
  );
}

function DataItem({ label, value, span }: { label: string; value: string; span?: number }) {
  return (
    <div className={span === 2 ? 'md:col-span-2' : ''}>
      <p className="text-[12px] sm:text-[13px] font-medium text-black/50 leading-[15px] sm:leading-[16px]">{label}</p>
      <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] font-bold text-black leading-[15px] sm:leading-[16px]">{value}</p>
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