'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Check } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import PageTransition from '../../components/PageTransition';  
import type { NotifType, Notifikasi } from './types';
import { DUMMY_NOTIFIKASI } from './data';

// ================= ICON MAP =================
const ICON_MAP: Record<NotifType, { Icon: typeof MessageCircle; bg: string; color: string }> = {
  komentar: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
};

export default function NotifikasiPage() {
  const router = useRouter();
  
  // State untuk mengontrol Sidebar di Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notif, setNotif] = useState<Notifikasi[]>(DUMMY_NOTIFIKASI);
  const [filter, setFilter] = useState<'Semua' | 'Belum Dibaca'>('Semua');

  const filtered = useMemo(() => {
    if (filter === 'Belum Dibaca') return notif.filter((n) => !n.dibaca);
    return notif;
  }, [notif, filter]);

  const countUnread = notif.filter((n) => !n.dibaca).length;

  // ===== Aksi =====
  const handleOpenNotif = (n: Notifikasi) => {
    setNotif((prev) => prev.map((x) => (x.id === n.id ? { ...x, dibaca: true } : x)));

    if (n.resepId) {
      router.push(`/unggah-data/resep?resepId=${n.resepId}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotif((prev) => prev.map((x) => ({ ...x, dibaca: true })));
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      
      <Sidebar 
        activePage="notifikasi" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        
        <Topbar 
          title="Notifikasi" 
          titleColor="#D45060" 
          hideSearch 
          hideNotif 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* DIPERBAIKI: Menambahkan overflow-x-hidden agar tidak ada scrollbar horizontal */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-[34px] pt-6 sm:pt-8 md:pt-[32px] pb-8 w-full max-w-full">
          
          {/* ============ HEADER ============ */}
          <div
            className="flex flex-wrap items-center justify-between mb-6 gap-4 w-full"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '22px',
            }}
          >
            <div style={{ minWidth: '220px', flex: '1 1 auto' }}>
              <h1
                className="font-bold text-black leading-tight"
                style={{ fontSize: '26px', color: '#000000' }}
              >
                Notifikasi
              </h1>
              <p
                className="text-black/60"
                style={{ fontSize: '14px', marginTop: '4px' }}
              >
                Aktivitas komentar terbaru dari ibu-ibu
              </p>
            </div>
            {countUnread > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="h-[42px] px-[20px] rounded-[10px] bg-white border border-[#D45060] text-[#D45060] hover:bg-[#D45060]/5 font-semibold text-[14px] flex items-center justify-center gap-[8px] transition-colors cursor-pointer shrink-0"
                style={{
                  width: 'auto',
                  padding: '0 18px',
                  height: '40px',
                }}
              >
                <Check className="w-[16px] h-[16px]" strokeWidth={2.5} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* ============ FILTER TABS ============ */}
          <div className="flex flex-wrap gap-2 sm:gap-[12px] mb-6 md:mb-[22px]">
            <FilterBtn active={filter === 'Semua'} onClick={() => setFilter('Semua')}>
              Semua ({notif.length})
            </FilterBtn>
            <FilterBtn active={filter === 'Belum Dibaca'} onClick={() => setFilter('Belum Dibaca')}>
              Belum Dibaca ({countUnread})
            </FilterBtn>
          </div>

          {/* ============ LIST NOTIFIKASI ============ */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-[14px] h-[220px] flex items-center justify-center px-4 text-center">
              <p className="text-sm sm:text-[16px] text-[#797777] font-medium">
                Tidak ada notifikasi untuk filter ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-[12px]">
              {filtered.map((n) => {
                const cfg = ICON_MAP[n.type];
                const Icon = cfg.Icon;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleOpenNotif(n)}
                    className={`w-full text-left rounded-[14px] border ${
                      !n.dibaca
                        ? 'border-[#D45060]/40 bg-[#F88B92]/[0.18]'
                        : 'border-[#D9D9D9] bg-white'
                    } p-4 sm:px-[22px] sm:py-[18px] hover:bg-[#F7F8F0] transition-colors cursor-pointer flex items-start gap-3 sm:gap-[16px]`}
                    style={{
                      backgroundColor: !n.dibaca
                        ? 'color-mix(in srgb, #F88B92 18%, #FFFFFF)'
                        : '#FFFFFF',
                    }}
                  >
                    <div className={`w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-[12px] sm:rounded-[14px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] ${cfg.color}`} strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-[15px] leading-snug sm:leading-[20px]">
                        <span className="font-bold text-black">{n.dariNama}</span>
                        <span className="text-black/70"> {n.deskripsi}</span>
                        {n.targetNama && (
                          <>
                            <span className="text-black/70"> </span>
                            <span className="font-semibold text-[#D45060]">
                              &quot;{n.targetNama}&quot;
                            </span>
                          </>
                        )}
                      </p>
                      <p className="mt-1 sm:mt-[4px] text-xs sm:text-[13px] text-[#8F8F8F]">{n.timestamp}</p>
                    </div>

                    {!n.dibaca && (
                      <span className="shrink-0 mt-1.5 sm:mt-[18px] w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full bg-[#D45060]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ================= SUB-COMPONENT =================
function FilterBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[38px] sm:h-[42px] px-4 sm:px-[20px] rounded-[9px] font-semibold text-sm sm:text-[15px] transition-colors cursor-pointer ${
        active ? 'bg-[#D45060] text-white' : 'bg-white text-[#797777] hover:bg-[#F7F8F0]'
      }`}
    >
      {children}
    </button>
  );
}