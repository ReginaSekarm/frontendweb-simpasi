'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pencil } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import LengkapiProfilModal from '../../components/LengkapiProfilModal';
import GantiKataSandiTab from '../../components/GantiKataSandiTab';
import ProfilToast from '../../components/ProfilToast';

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

  const [showLengkapi, setShowLengkapi] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'password'>('profil');
  const [profil] = useState<ProfilKader>(DUMMY_PROFIL);

  useEffect(() => {
    if (lengkapiParam === '1') setShowLengkapi(true);
  }, [lengkapiParam]);

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
        <Topbar title="Pengaturan" titleColor="#000000" />

        <div className="flex-1 overflow-y-auto px-[38px] pt-[25px] pb-8">
          {/* ============ TABS ============ */}
          <div className="w-[506px] h-[73px] bg-[#FEEB96] rounded-[17px] p-[8px] flex mb-[32px]">
            {(['profil', 'password'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-[17px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${
                  activeTab === tab ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6]/80 hover:bg-[#FFE9A8]'
                }`}
              >
                {tab === 'profil' ? 'Profil' : 'Ganti Kata Sandi'}
              </button>
            ))}
          </div>

          {activeTab === 'profil' && (
            <div className="bg-white rounded-[17px] border border-[#AAA6A6]/70 px-[46px] pt-[31px] pb-[42px] max-w-[1026px]">
              {/* ============ HEADER ============ */}
              <div className="flex items-start justify-between mb-[42px]">
                <div>
                  <h1 className="text-[30px] font-bold text-black leading-tight">Profil Kader</h1>
                  <p className="mt-[8px] text-[18px] font-bold text-black/50 leading-[22px]">
                    Lihat data diri dan tugas posyandu Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEdit(true)}
                  className="flex items-center gap-[12px] h-[57px] px-[28px] bg-[#D45060] hover:bg-[#c44454] text-white font-semibold text-[27px] rounded-[17px] transition-colors cursor-pointer"
                >
                  <Pencil className="w-[30px] h-[30px]" strokeWidth={2.2} />
                  <span>Edit Profil</span>
                </button>
              </div>

              {/* ============ AVATAR + NAMA ============ */}
              <div className="flex items-center gap-[64px] mb-[44px]">
                <div className="w-[169px] h-[169px] rounded-full overflow-hidden bg-[#D9D9D9] shrink-0">
                  {profil.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profil.foto} alt="Foto Profil" className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/images/profil-kader.png"
                      alt="Foto Profil"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>

                <div>
                  <h2 className="text-[30px] font-semibold text-black leading-[37px]">Siti Amaliah</h2>
                  <span className="inline-flex items-center mt-[14px] h-[38px] px-[16px] bg-[#D9D9D9]/70 rounded-[17px] text-[17px] font-bold text-[#1A7772] leading-[20px]">
                    Kader Aktif
                  </span>
                  <p className="mt-[14px] text-[18px] font-medium text-black/50 leading-[22px]">
                    Bergabung sejak 12 Maret 2022
                  </p>
                </div>
              </div>

              <div className="border-t border-black/50 mb-[36px]" />

              {/* ============ DATA PRIBADI ============ */}
              <SectionTitle>Data Pribadi</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[120px] gap-y-[42px] mb-[62px]">
                {DATA_PRIBADI.map((item) => (
                  <DataItem key={item.label} label={item.label} value={item.value} span={item.span} />
                ))}
              </div>

              {/* ============ DATA TUGAS POSYANDU ============ */}
              <SectionTitle>Data Tugas Posyandu</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[120px] gap-y-[42px]">
                {DATA_TUGAS.map((item) => (
                  <DataItem key={item.label} label={item.label} value={item.value} />
                ))}
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

      {showLengkapi && <LengkapiProfilModal onSaved={handleSavedLengkapi} />}

      {showEdit && (
        <LengkapiProfilModal onSaved={handleSavedEdit} onClose={() => setShowEdit(false)} />
      )}

      {showToast && <ProfilToast onClose={() => setShowToast(false)} />}
    </div>
  );
}

// ================= SUB-COMPONENTS =================
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[#D45060] font-bold text-[17px] uppercase tracking-wide mb-[26px] leading-[20px]">
      {children}
    </h3>
  );
}

function DataItem({ label, value, span }: { label: string; value: string; span?: number }) {
  return (
    <div className={span === 2 ? 'md:col-span-2' : ''}>
      <p className="text-[18px] font-medium text-black/50 leading-[22px]">{label}</p>
      <p className="mt-[10px] text-[17px] font-bold text-black leading-[20px]">{value}</p>
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