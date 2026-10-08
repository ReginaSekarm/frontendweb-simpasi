'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Check } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import type { NotifType, Notifikasi } from './_types';
import { DUMMY_NOTIFIKASI } from './data';

// ================= ICON MAP =================
const ICON_MAP: Record<NotifType, { Icon: typeof MessageCircle; bg: string; color: string }> = {
  komentar: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
};

export default function NotifikasiPage() {
  const router = useRouter();

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

    // Komentar langsung ke halaman resep dengan modal terbuka
    if (n.resepId) {
      router.push(`/unggah-data?tab=Resep&resepId=${n.resepId}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotif((prev) => prev.map((x) => ({ ...x, dibaca: true })));
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="notifikasi" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Notifikasi" titleColor="#D45060" showSearch searchPlaceholder="Cari notifikasi..." />

        <div className="flex-1 overflow-y-auto px-[34px] pt-[32px] pb-8">
          {/* ============ HEADER ============ */}
          <div className="flex items-center justify-between mb-[22px]">
            <div>
              <h1 className="text-[30px] font-bold text-black leading-tight">Notifikasi</h1>
              <p className="mt-[6px] text-[15px] text-black/60">
                Aktivitas komentar terbaru dari ibu-ibu
              </p>
            </div>
            {countUnread > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="h-[42px] px-[20px] rounded-[10px] bg-white border border-[#D45060] text-[#D45060] hover:bg-[#D45060]/5 font-semibold text-[14px] flex items-center gap-[8px] transition-colors cursor-pointer"
              >
                <Check className="w-[16px] h-[16px]" strokeWidth={2.5} />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* ============ FILTER TABS ============ */}
          <div className="flex flex-wrap gap-[12px] mb-[22px]">
            <FilterBtn active={filter === 'Semua'} onClick={() => setFilter('Semua')}>
              Semua ({notif.length})
            </FilterBtn>
            <FilterBtn active={filter === 'Belum Dibaca'} onClick={() => setFilter('Belum Dibaca')}>
              Belum Dibaca ({countUnread})
            </FilterBtn>
          </div>

          {/* ============ LIST NOTIFIKASI ============ */}
          {filtered.length === 0 ? (
            <div className="bg-white rounded-[14px] h-[220px] flex items-center justify-center">
              <p className="text-[16px] text-[#797777] font-medium">
                Tidak ada notifikasi untuk filter ini.
              </p>
            </div>
          ) : (
            <div className="space-y-[12px]">
              {filtered.map((n) => {
                const cfg = ICON_MAP[n.type];
                const Icon = cfg.Icon;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => handleOpenNotif(n)}
                    className={`w-full text-left bg-white rounded-[14px] border ${
                      !n.dibaca ? 'border-[#D45060]/40 bg-[#FEF6F7]' : 'border-[#D9D9D9]'
                    } px-[22px] py-[18px] hover:bg-[#F7F8F0] transition-colors cursor-pointer flex items-start gap-[16px]`}
                  >
                    <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className={`w-[24px] h-[24px] ${cfg.color}`} strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] leading-[20px]">
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
                      <p className="mt-[4px] text-[13px] text-[#8F8F8F]">{n.timestamp}</p>
                    </div>

                    {!n.dibaca && (
                      <span className="shrink-0 mt-[18px] w-[10px] h-[10px] rounded-full bg-[#D45060]" />
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
      className={`h-[42px] px-[20px] rounded-[9px] font-semibold text-[15px] transition-colors cursor-pointer ${
        active ? 'bg-[#D45060] text-white' : 'bg-white text-[#797777] hover:bg-[#F7F8F0]'
      }`}
    >
      {children}
    </button>
  );
}