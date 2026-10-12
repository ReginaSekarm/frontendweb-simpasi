'use client';

import { CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import type { ToastType } from '../types';

type Props = {
  type: ToastType;
  title: string;
  message: string;
};

export default function Toast({ type, title, message }: Props) {
  const accentColor = type === 'success' ? '#2E9C52' : '#D45060';

  return (
    // 👇 Ukuran container, posisi, dan rounded disesuaikan
    <div
      className="fixed top-[24px] right-[24px] z-[10000] w-[380px] h-[100px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-[slideIn_0.3s_ease-out]"
      style={{ background: accentColor }}
    >
      {/* 👇 Padding, gap, dan inner rounded disesuaikan */}
      <div className="absolute left-[6px] top-0 right-0 bottom-0 bg-white rounded-[12px] flex items-start gap-[12px] px-[16px] py-[16px]">
        
        {/* 👇 Ukuran wadah ikon dan ikon diperkecil */}
        <div className="shrink-0 w-[28px] h-[28px] flex items-center justify-center">
          {type === 'success' ? (
            <CheckCircle2 className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : type === 'delete' ? (
            <Trash2 className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : (
            <AlertTriangle className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-[1px]">
          {/* 👇 Ukuran font judul dan deskripsi diperkecil */}
          <h3 className="text-black font-bold text-[15px] leading-[18px]">{title}</h3>
          <p className="mt-[4px] text-black/70 text-[13px] leading-[16px]">{message}</p>
        </div>
      </div>
    </div>
  );
}