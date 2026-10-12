'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import KonfirmasiKeluarModal from './KonfirmasiKeluarModal';

// ================= ICON CUSTOM (dari file SVG) =================
type IconProps = { className?: string };

const DashboardIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zM4 16a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"
    />
  </svg>
);

const HandsHoldingChildIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className={className}>
    <path
      fill="currentColor"
      d="M320 0a40 40 0 1 1 0 80a40 40 0 1 1 0-80m44.7 164.3l11.1 88.7c1.6 13.2-7.7 25.1-20.8 26.8s-25.1-7.7-26.8-20.8l-4.4-35h-7.6l-4.4 35c-1.6 13.2-13.6 22.5-26.8 20.8s-22.5-13.6-20.8-26.8l11.1-88.8l-19.8 16.8c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l27.9-23.6c18.9-16 42.9-24.8 67.6-24.8s48.7 8.8 67.6 24.7l27.9 23.6c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.4-33.8 2.8l-19.8-16.7zM40 64c22.1 0 40 17.9 40 40v160.2c0 17 6.7 33.3 18.7 45.3l51.1 51.1c8.3 8.3 21.3 9.6 31 3.1c12.9-8.6 14.7-26.9 3.7-37.8l-15.2-15.2l-32-32c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l32 32l15.2 15.2l25.3 25.3c21 21 32.8 49.5 32.8 79.2V464c0 26.5-21.5 48-48 48h-66.7c-17 0-33.3-6.7-45.3-18.7l-99.8-99.9C10.1 375.4 0 351 0 325.5V104c0-22.1 17.9-40 40-40m560 0c22.1 0 40 17.9 40 40v221.5c0 25.5-10.1 49.9-28.1 67.9L512 493.3c-12 12-28.3 18.7-45.3 18.7H400c-26.5 0-48-21.5-48-48v-78.9c0-29.7 11.8-58.2 32.8-79.2l25.3-25.3l15.2-15.2l32-32c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-32 32l-15.2 15.2c-11 11-9.2 29.2 3.7 37.8c9.7 6.5 22.7 5.2 31-3.1l51.1-51.1c12-12 18.7-28.3 18.7-45.3V104c0-22.1 17.9-40 40-40z"
    />
  </svg>
);

const CloudUploadIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" className={className}>
    <path
      fill="currentColor"
      d="M8.5 5C6.57 5 5 6.57 5 8.5S6.57 12 8.5 12S12 10.43 12 8.5S10.43 5 8.5 5m1.85 3.35c-.2.2-.51.2-.71 0l-.65-.65v2.79c0 .28-.22.5-.5.5s-.5-.22-.5-.5V7.7l-.65.65c-.2.2-.51.2-.71 0s-.2-.51 0-.71l1.5-1.5s.1-.08.16-.11c.06-.02.12-.04.19-.04s.13.01.19.04c.06.02.11.06.16.11l1.5 1.5c.2.2.2.51 0 .71zM4.05 9c.04.35.11.68.23 1H3c-1.65 0-3-1.35-3-3c0-1.49 1.1-2.74 2.53-2.96C2.76 2.33 4.23 1 6 1s3.24 1.32 3.47 3.04v.08A4.4 4.4 0 0 0 8.5 4h-.05A2.51 2.51 0 0 0 6 1.99a2.5 2.5 0 0 0-2.5 2.5c0 .28-.22.5-.5.5c-1.1 0-2 .9-2 2s.9 2 2 2h1.05z"
    />
  </svg>
);

const PeopleSettingsIcon = ({ className }: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path
      fill="currentColor"
      d="M5.5 7a2.5 2.5 0 1 1 5 0a2.5 2.5 0 0 1-5 0M8 3a4 4 0 1 0 0 8a4 4 0 0 0 0-8m7.5 5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0M17 5a3 3 0 1 0 0 6a3 3 0 0 0 0-6M4.25 13A2.25 2.25 0 0 0 2 15.25v.278a2 2 0 0 0 .014.208a4.5 4.5 0 0 0 .778 2.07C3.61 18.974 5.172 20 8 20c1.369 0 2.441-.24 3.276-.62a6.5 6.5 0 0 1-.268-1.55c-.645.38-1.595.67-3.008.67c-2.422 0-3.486-.85-3.98-1.555a3 3 0 0 1-.513-1.359l-.007-.079v-.257a.75.75 0 0 1 .75-.75h7.482c.249-.477.555-.919.909-1.317A2.2 2.2 0 0 0 11.75 13zm10.027.976a2 2 0 0 1-1.441 2.496l-.584.145a5.7 5.7 0 0 0 .006 1.807l.54.13a2 2 0 0 1 1.45 2.51l-.187.631c.44.386.94.7 1.485.922l.493-.519a2 2 0 0 1 2.899 0l.499.526a5.3 5.3 0 0 0 1.482-.913l-.198-.686a2 2 0 0 1 1.442-2.496l.583-.145a5.7 5.7 0 0 0-.006-1.807l-.54-.13a2 2 0 0 1-1.449-2.51l.186-.631a5.3 5.3 0 0 0-1.484-.922l-.493.518a2 2 0 0 1-2.9 0l-.498-.525c-.544.22-1.044.53-1.483.913zM17.5 19c-.8 0-1.45-.671-1.45-1.5c0-.828.65-1.5 1.45-1.5s1.45.672 1.45 1.5c0 .829-.65 1.5-1.45 1.5"
    />
  </svg>
);

// ================= TYPES =================
export type ActivePage =
  | 'dashboard'
  | 'data-balita'
  | 'unggah-data'
  | 'notifikasi'
  | 'pengaturan';

type SidebarProps = {
  activePage: ActivePage;
  isOpen?: boolean;
  onClose?: () => void;
};

type MenuItem = {
  key: ActivePage;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

// ================= NAV =================
const NAV_BASE =
  'flex items-center h-[38px] pl-[12px] gap-[12px] rounded-l-full font-semibold text-[16px] transition-colors';

// ================= MENU ITEMS =================
const MENU_ITEMS: MenuItem[] = [
  { key: 'dashboard',   href: '/dashboard',   label: 'Dashboard',   icon: DashboardIcon },
  { key: 'data-balita', href: '/data-balita', label: 'Data Balita', icon: HandsHoldingChildIcon },
  { key: 'unggah-data', href: '/unggah-data', label: 'Unggah Data', icon: CloudUploadIcon },
  { key: 'pengaturan',  href: '/pengaturan',  label: 'Pengaturan',  icon: PeopleSettingsIcon },
];

// ================= COMPONENT =================
export default function Sidebar({
  activePage,
  isOpen = true,
  onClose,
}: SidebarProps) {
  const [showKeluarModal, setShowKeluarModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 👇 Untuk memastikan createPortal hanya jalan di client (setelah mount)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* 👇 BACKDROP — hanya muncul di mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[240px] shrink-0 h-full bg-[#D45060] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo + Judul */}
        <div className="flex items-center gap-[10px] px-[16px] h-[80px] border-b border-[#D9D9D9]/40">
          <div className="w-[40px] h-[40px] shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/start-face.png"
              alt="Logo SiMPASI"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-[18px] leading-[20px]">SiMPASI</h1>
            <p className="text-white text-[13px] leading-[15px]">Kader Posyandu</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 pl-[16px] pt-[16px] space-y-[6px]">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => onClose?.()}
                className={`${NAV_BASE} ${
                  isActive ? 'bg-[#B3EAE8] text-[#1A7772]' : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="w-[22px] flex justify-center shrink-0 relative">
                  <Icon className="w-[20px] h-[20px]" />
                </span>
                <span className="flex-1 pr-[12px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Keluar */}
        <div className="pl-[16px] pr-[16px] pb-[16px]">
          <button
            type="button"
            onClick={() => setShowKeluarModal(true)}
            className="w-full h-[40px] bg-white/60 hover:bg-white/80 rounded-[10px] text-[#FF0000] font-medium text-[16px] transition-colors cursor-pointer">
            Keluar
          </button>
        </div>
      </aside>

      {/* 👇 MODAL KONFIRMASI KELUAR — di-render lewat PORTAL ke document.body
          supaya tidak terjebak di dalam <aside> yang punya `transform` */}
      {mounted && showKeluarModal && createPortal(
        <KonfirmasiKeluarModal
          onTetap={() => setShowKeluarModal(false)}
          onKeluar={() => {
            setShowKeluarModal(false);
            window.location.href = '/login';
          }}
        />,
        document.body
      )}
    </>
  );
}