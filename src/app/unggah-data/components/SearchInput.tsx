'use client';

import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
};

export default function SearchInput({ value, onChange, placeholder, className = '' }: Props) {
  return (
    // 👇 Lebar maksimum diperkecil dari 555px menjadi 380px
    <div className={`relative w-full max-w-[380px] ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // 👇 Tinggi, padding, font, dan rounded disesuaikan
        className="w-full h-[40px] pl-5 pr-11 rounded-[8px] border border-black/25 bg-white text-[13px] font-semibold text-black placeholder-[#8F8F8F] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
      />
      {/* 👇 Ukuran ikon search diperkecil dari 28px menjadi 18px */}
      <Search
        className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8F8F8F]"
        strokeWidth={2}
      />
    </div>
  );
}