'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  CloudUpload,
  Settings,
} from 'lucide-react';

// ================= TYPES =================
export type ActivePage =
  | 'dashboard'
  | 'data-balita'
  | 'unggah-data'
  | 'notifikasi'
  | 'pengaturan';

type SidebarProps = {
  activePage: ActivePage;
};

type MenuItem = {
  key: ActivePage;
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: number;
};

// ================= NAV =================
const NAV_BASE =
  'flex items-center h-[47px] pl-[16px] gap-[27px] rounded-l-full font-semibold text-[24px] transition-colors';

// ================= MENU ITEMS =================
const MENU_ITEMS: MenuItem[] = [
  { key: 'dashboard',   href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'data-balita', href: '/data-balita', label: 'Data Balita', icon: Users },
  { key: 'unggah-data', href: '/unggah-data', label: 'Unggah Data', icon: CloudUpload },
  { key: 'pengaturan',  href: '/pengaturan',  label: 'Pengaturan',  icon: Settings },
];

// ================= COMPONENT =================
export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="w-[341px] shrink-0 h-full bg-[#D45060] flex flex-col relative">
      {/* Logo + Judul */}
      <div className="flex items-center gap-[15px] px-[17px] h-[103px] border-b border-[#D9D9D9]/40">
        <div className="w-[60px] h-[60px] shrink-0 flex items-center justify-center">
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
          <h1 className="text-white font-bold text-[24px] leading-[27px]">SiMPASI</h1>
          <p className="text-white text-[24px] leading-[27px]">Kader Posyandu</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 pl-[52px] pt-[20px] space-y-[9px]">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`${NAV_BASE} ${
                isActive ? 'bg-[#B3EAE8] text-[#1A7772]' : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="w-[34px] flex justify-center shrink-0 relative">
                <Icon className="w-[28px] h-[28px]" strokeWidth={isActive ? 2.4 : 2.2} />
              </span>
              <span className="flex-1 pr-[20px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Keluar */}
      <div className="pl-[21px] pr-[31px] pb-[19px]">
        <button
          type="button"
          onClick={() => {
            if (confirm('Yakin ingin keluar?')) {
              window.location.href = '/login';
            }
          }}
          className="w-full h-[58px] bg-white/60 hover:bg-white/80 rounded-[17px] text-[#FF0000] font-medium text-[28px] transition-colors cursor-pointer"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}