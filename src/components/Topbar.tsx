'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CircleUserRound, Bell, MessageCircle, Menu, X } from 'lucide-react';
import { useProfilFoto } from './profilFoto'; 
import { api } from '../lib/api';

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

interface ApiNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean | number;
  created_at: string;
}

// ================= ICON MAP =================
const ICON_MAP: Record<string, { Icon: typeof MessageCircle; bg: string; color: string }> = {
  komentar: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
  default: { Icon: MessageCircle, bg: 'bg-[#F88B92]/40', color: 'text-[#DD2E44]' },
};

// ================= HELPER =================
function getNotifHref(n: ApiNotification): string {
  if (n.type === 'komentar' || n.type === 'resep') {
    return '/notifikasi';
  }
  return '/notifikasi';
}

function formatTimeAgo(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${Math.max(1, diffHours)} jam yang lalu`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari`;
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
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);

  const notifRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch notifikasi real-time untuk dropdown topbar
  useEffect(() => {
    const fetchTopbarNotifs = async () => {
      try {
        const result = await api<any>('/notifications');
        if (result.success) {
          setNotifications(result.data || []);
        }
      } catch (error) {
        console.error('Gagal memuat notifikasi topbar:', error);
      }
    };
    fetchTopbarNotifs();
  }, []);

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

  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus(), 100);
    }
  }, [mobileSearchOpen]);

  const handleOpenMobileSearch = () => {
    setMobileSearchOpen(true);
    setOpenNotif(false);
  };

  const computedUnread = notifications.filter((n) => !n.is_read).length;
  const finalCount = notifCount ?? computedUnread;
  const fotoProfil = useProfilFoto();
  const finalAvatar = fotoProfil || avatarSrc || '';
  const previewNotif = notifications.slice(0, 4);

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
          <input
            ref={mobileSearchRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 h-[38px] px-4 rounded-full bg-white border border-black/40 text-[13px] text-gray-700 placeholder-[#8F8F8F]/80 focus:outline-none focus:border-[#D45060] transition-colors"
          />

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
              className="font-bold text-[16px] sm:text-[18px] lg:text-[16px] leading-[22px] lg:leading-[24px] truncate"
              style={{ color: titleColor }}
            >
              {title}
            </h1>
          </div>

          {/* KANAN: Search + Bell + Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {showSearch && !hideSearch && (
              <>
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
                          const cfg = ICON_MAP[n.type || 'default'] || ICON_MAP.default;
                          const Icon = cfg.Icon;
                          const isRead = Boolean(n.is_read);

                          return (
                            <Link
                              key={n.id}
                              href={getNotifHref(n)}
                              onClick={() => setOpenNotif(false)}
                              className={`flex items-start gap-2.5 px-4 py-2.5 border-b border-[#F0F0F0] last:border-b-0 transition-colors cursor-pointer ${
                                !isRead ? 'bg-[#FEF6F7] hover:bg-[#FCEBED]' : 'hover:bg-[#F7F8F0]'
                              }`}
                            >
                              <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                <Icon className={`w-[16px] h-[16px] ${cfg.color}`} strokeWidth={2} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] leading-[16px]">
                                  <span className="font-bold text-black">{n.title}</span>
                                </p>
                                <p className="text-[11px] text-black/70 mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                                <p className="mt-0.5 text-[10px] text-[#8F8F8F]">{formatTimeAgo(n.created_at)}</p>
                              </div>
                              {!isRead && (
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
            <Link
              href="/pengaturan"
              aria-label="Ke Profil Pengaturan"
              className="relative w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] rounded-full bg-[#D9D9D9] overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-[#D45060]/60 transition-all"
            >
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
            </Link>
          </div>
        </>
      )}
    </header>
  );
}