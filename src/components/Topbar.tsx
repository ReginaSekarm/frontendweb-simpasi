'use client';

import React from 'react';
import { CircleUserRound } from 'lucide-react';

// ================= TYPES =================
type TopbarProps = {
  /** Judul di kiri (misal "Dashboard", "Data Balita") */
  title: string;
  /** Warna judul. Default hitam. */
  titleColor?: string;
  /** Kalau false, search box disembunyikan */
  showSearch?: boolean;
  /** Placeholder search box */
  searchPlaceholder?: string;
  /** Nilai search (opsional, untuk controlled input) */
  searchValue?: string;
  /** Handler search (opsional) */
  onSearchChange?: (value: string) => void;
  /** Path gambar avatar */
  avatarSrc?: string;
  /** Tinggi topbar dalam px. Default 73 (sesuai Figma dashboard) */
  height?: number;
};

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
}: TopbarProps) {
  return (
    <header
      className="bg-white flex items-center justify-between pl-[30px] pr-[46px] shadow-[0_4.5px_4.5px_rgba(0,0,0,0.15)] shrink-0"
      style={{ height }}
    >
      {/* Judul */}
      <h1
        className="font-bold text-[26px] leading-[31px]"
        style={{ color: titleColor }}
      >
        {title}
      </h1>

      {/* Kanan: Search + Avatar */}
      <div className="flex items-center gap-[29px]">
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

        {/* Avatar: ikon cadangan di belakang, foto di depan */}
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