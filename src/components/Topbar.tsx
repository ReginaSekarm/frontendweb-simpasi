'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CircleUserRound, Bell, MessageCircle, Menu, X } from 'lucide-react';
import { DUMMY_NOTIFIKASI } from '../app/notifikasi/data';
import { useProfilFoto } from './profilFoto'; 

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
  hideSearch?: boolean;
  hideNotif?: boolean;
  onMenuClick?: () => void;
};

// ================= ICON MAP =================
type NotifType = 'komentar';

const ICON_MAP: Record<NotifType, { Icon: typeof MessageCircle; bg: string; color: string }> = {
  komentar: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
};

// ================= HELPER =================
function getNotifHref(n: { type: NotifType; resepId?: number }): string {
  if (n.type === 'komentar' && n.resepId) {
    return `/unggah-data/resep?resepId=${n.resepId}`;
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
  avatarSrc,
  height = 60,
  notifCount,
  hideSearch = false,
  hideNotif = false,
  onMenuClick,
}: TopbarProps) {
  const [openNotif, setOpenNotif] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchWrapperRef = useRef<HTMLDivElement>(null);

  // Tutup notif dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setOpenNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const handleClickOutsideSearch = (e: MouseEvent | TouchEvent) => {
      if (
        mobileSearchWrapperRef.current &&
        !mobileSearchWrapperRef.current.contains(e.target as Node)
      ) {
        // Klik di luar search → tutup
        setMobileSearchOpen(false);
        onSearchChange?.('');
      }
    };

    document.addEventListener('mousedown', handleClickOutsideSearch);
    document.addEventListener('touchstart', handleClickOutsideSearch);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSearch);
      document.removeEventListener('touchstart', handleClickOutsideSearch);
    };
  }, [mobileSearchOpen, onSearchChange]);

  // Auto-focus input saat mobile search terbuka
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  // Handler buka mobile search
  const handleOpenMobileSearch = () => {
    setMobileSearchOpen(true);
    setOpenNotif(false);
  };

  const computedUnread = DUMMY_NOTIFIKASI.filter((n) => !n.dibaca).length;
  const finalCount = notifCount ?? computedUnread;
  const fotoProfil = useProfilFoto();
  // Profil jadi sumber utama → kalau profil kosong, fallback ke avatarSrc (kalau ada), kalau dua-duanya kosong → icon default
  const finalAvatar = fotoProfil || avatarSrc || '';
  const previewNotif = DUMMY_NOTIFIKASI.slice(0, 4);

  return (
    <header
      className="bg-white flex items-center justify-between px-3 sm:px-4 lg:px-[24px] shadow-[0_3px_4px_rgba(0,0,0,0.15)] shrink-0 relative z-30"
      style={{ height }}
    >
      {/* ============ MOBILE: SEARCH MODE ============ */}
      {mobileSearchOpen ? (
       <div
          ref={mobileSearchWrapperRef}
          className="flex items-center gap-2 w-full md:hidden"
        >
          {/* Input search */}
          <input
            ref={mobileSearchRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 h-[38px] px-4 rounded-full bg-white border border-black/40 text-[13px] text-gray-700 placeholder-[#8F8F8F]/80 focus:outline-none focus:border-[#D45060] transition-colors"
          />

          {/* Tombol clear (muncul kalau ada teks) */}
          {searchValue && searchValue.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              aria-label="Hapus pencarian"
              className="shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-[18px] h-[18px] text-black" strokeWidth={2.2} />
            </button>
          )}
        </div>
      ) : (
        <>
          {/* KIRI: Hamburger + Judul */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {onMenuClick && (
              <button
                type="button"
                onClick={onMenuClick}
                aria-label="Buka menu"
                className="lg:hidden shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
              >
                <Menu className="w-[22px] h-[22px] text-black" strokeWidth={2.2} />
              </button>
            )}
            <h1
              className="font-bold text-[16px] sm:text-[18px] lg:text-[20px] leading-[22px] lg:leading-[24px] truncate"
              style={{ color: titleColor }}
            >
              {title}
            </h1>
          </div>

          {/* KANAN: Search + Bell + Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showSearch && !hideSearch && (
              <>
                {/* Desktop: search full input */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-[220px] lg:w-[300px] h-[34px] pl-4 pr-10 rounded-full bg-white border border-black/50 text-[13px] text-gray-700 placeholder-[#8F8F8F]/80 focus:outline-none focus:border-[#D45060] transition-colors"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#8F8F8F]/80"
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>

                {/* Mobile: icon search → klik untuk expand input */}
                <button
                  type="button"
                  onClick={handleOpenMobileSearch}
                  aria-label="Cari"
                  className="md:hidden shrink-0 w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
                >
                  <svg className="w-[18px] h-[18px] text-black" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </>
            )}

            {!hideNotif && (
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setOpenNotif(!openNotif)}
                  aria-label="Notifikasi"
                  className="relative w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
                >
                  <Bell className="w-[20px] h-[20px] text-black" strokeWidth={2.2} />
                  {finalCount > 0 && (
                    <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full bg-[#D45060] text-white text-[9px] font-bold border-[1.5px] border-white leading-none">
                      {finalCount > 99 ? '99+' : finalCount}
                    </span>
                  )}
                </button>

                {openNotif && (
                  <div className="absolute right-0 top-[42px] w-[calc(100vw-24px)] sm:w-[340px] max-w-[340px] bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-[#D9D9D9] overflow-hidden z-[100]">
                    <div className="px-4 py-3 border-b border-[#D9D9D9] flex items-center justify-between">
                      <h3 className="text-[14px] font-bold text-black">Notifikasi</h3>
                      <span className="text-[11px] text-[#8F8F8F]">{finalCount} baru</span>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                      {previewNotif.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[12px] text-[#797777]">
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
                              className={`flex items-start gap-2.5 px-4 py-2.5 border-b border-[#F0F0F0] last:border-b-0 transition-colors cursor-pointer ${
                                !n.dibaca ? 'bg-[#FEF6F7] hover:bg-[#FCEBED]' : 'hover:bg-[#F7F8F0]'
                              }`}
                            >
                              <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                <Icon className={`w-[16px] h-[16px] ${cfg.color}`} strokeWidth={2} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] leading-[16px]">
                                  <span className="font-bold text-black">{n.dariNama}</span>
                                  <span className="text-black/70"> {n.deskripsi}</span>
                                  {n.targetNama && (
                                    <>
                                      <span className="text-black/70"> </span>
                                      <span className="font-semibold text-[#D45060]">&quot;{n.targetNama}&quot;</span>
                                    </>
                                  )}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[#8F8F8F]">{n.timestamp}</p>
                              </div>
                              {!n.dibaca && (
                                <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-[#D45060]" />
                              )}
                            </Link>
                          );
                        })
                      )}
                    </div>

                    <Link
                      href="/notifikasi"
                      onClick={() => setOpenNotif(false)}
                      className="block text-center py-2.5 text-[12px] font-semibold text-[#D45060] hover:bg-[#FCEBED] transition-colors cursor-pointer"
                    >
                      Lihat Semua Notifikasi
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Avatar */}
            <div className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#D9D9D9] overflow-hidden shrink-0">
              <CircleUserRound className="absolute inset-0 w-full h-full text-black/70" />
              {finalAvatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={finalAvatar}
                  src={finalAvatar}
                  alt="Profile Kader"
                  className="relative w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}