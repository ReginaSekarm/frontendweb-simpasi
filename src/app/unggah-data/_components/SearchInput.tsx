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
    <div className={`relative w-full max-w-[555px] ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[56px] pl-[29px] pr-14 rounded-[9px] border border-black/25 bg-white text-[20px] font-semibold text-black placeholder-[#8F8F8F] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
      />
      <Search
        className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] text-[#8F8F8F]"
        strokeWidth={2}
      />
    </div>
  );
}