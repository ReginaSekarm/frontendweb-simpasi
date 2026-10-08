'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CircleUserRound, Bell, MessageCircle, Info } from 'lucide-react';
import { DUMMY_NOTIFIKASI } from '../app/notifikasi/data';

// ================= TYPES =================
type TopbarProps = {
  title: string;
  titleColor?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  avatarSrc?: string;
  height?: number;
  notifCount?: number;
};

// ================= ICON MAP =================
type NotifType = 'komentar';

const ICON_MAP: Record<NotifType, { Icon: typeof MessageCircle; bg: string; color: string }> = {
  komentar: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
};

// ================= HELPER =================
// Bikin href dinamis: kalau notif komentar → direct ke resep, kalau sistem → ke /notifikasi
function getNotifHref(n: { type: NotifType; resepId?: number }): string {
  if (n.type === 'komentar' && n.resepId) {
    return `/unggah-data?tab=Resep&resepId=${n.resepId}`;
  }
  return '/notifikasi';
}

// ================= COMPONENT =================
export default function Topbar({
  title,
  titleColor = '#000000',
  showSearch = false,
  searchPlaceholder = 'Search........',
  searchValue,
  onSearchChange,
  avatarSrc = '/images/profil-kader.png',
  height = 73,
  notifCount,
}: TopbarProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const computedUnread = DUMMY_NOTIFIKASI.filter((n) => !n.dibaca).length;
  const finalCount = notifCount ?? computedUnread;
  const previewNotif = DUMMY_NOTIFIKASI.slice(0, 4);

  return (
    <header
      className="bg-white flex items-center justify-between pl-[30px] pr-[46px] shadow-[0_4.5px_4.5px_rgba(0,0,0,0.15)] shrink-0 relative z-30"
      style={{ height }}
    >
      <h1 className="font-bold text-[26px] leading-[31px]" style={{ color: titleColor }}>
        {title}
      </h1>

      <div className="flex items-center gap-[20px]">
        {showSearch && (
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-[417px] h-[40px] pl-6 pr-12 rounded-full bg-white border border-black/50 text-[16px] text-gray-700 placeholder-[#8F8F8F]/80 focus:outline-none focus:border-[#D45060] transition-colors"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8F8F8F]/80"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        )}

        {/* ===== Bell + Dropdown ===== */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setOpenNotif(!openNotif)}
            aria-label="Notifikasi"
            className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <Bell className="w-[26px] h-[26px] text-black" strokeWidth={2.2} />
            {finalCount > 0 && (
              <span className="absolute top-[2px] right-[2px] min-w-[20px] h-[20px] px-[6px] flex items-center justify-center rounded-full bg-[#D45060] text-white text-[11px] font-bold border-[2px] border-white leading-none">
                {finalCount > 99 ? '99+' : finalCount}
              </span>
            )}
          </button>

          {openNotif && (
            <div className="absolute right-0 top-[54px] w-[400px] bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-[#D9D9D9] overflow-hidden z-[100]">
              <div className="px-[20px] py-[16px] border-b border-[#D9D9D9] flex items-center justify-between">
                <h3 className="text-[17px] font-bold text-black">Notifikasi</h3>
                <span className="text-[13px] text-[#8F8F8F]">{finalCount} baru</span>
              </div>

              <div className="max-h-[380px] overflow-y-auto">
                {previewNotif.length === 0 ? (
                  <div className="px-[20px] py-[30px] text-center text-[14px] text-[#797777]">
                    Belum ada notifikasi.
                  </div>
                ) : (
                  previewNotif.map((n) => {
                    const cfg = ICON_MAP[n.type];
                    const Icon = cfg.Icon;
                    return (
                      <Link
                        key={n.id}
                        href={getNotifHref(n)}
                        onClick={() => setOpenNotif(false)}
                        className={`flex items-start gap-[14px] px-[20px] py-[14px] border-b border-[#F0F0F0] last:border-b-0 transition-colors cursor-pointer ${
                          !n.dibaca ? 'bg-[#FEF6F7] hover:bg-[#FCEBED]' : 'hover:bg-[#F7F8F0]'
                        }`}
                      >
                        <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <Icon className={`w-[20px] h-[20px] ${cfg.color}`} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] leading-[18px]">
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
                          <p className="mt-[2px] text-[12px] text-[#8F8F8F]">{n.timestamp}</p>
                        </div>
                        {!n.dibaca && (
                          <span className="shrink-0 mt-[12px] w-[8px] h-[8px] rounded-full bg-[#D45060]" />
                        )}
                      </Link>
                    );
                  })
                )}
              </div>

              <Link
                href="/notifikasi"
                onClick={() => setOpenNotif(false)}
                className="block text-center py-[14px] text-[14px] font-semibold text-[#D45060] hover:bg-[#FCEBED] transition-colors cursor-pointer"
              >
                Lihat Semua Notifikasi
              </Link>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative w-[56px] h-[56px] rounded-full bg-[#D9D9D9] overflow-hidden shrink-0">
          <CircleUserRound className="absolute inset-0 w-full h-full text-black/70" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt="Profile Kader"
            className="relative w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>
    </header>
  );
}