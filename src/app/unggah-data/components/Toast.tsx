'use client';

import { CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import type { ToastType } from '../types';

type Props = {
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
};

export default function Toast({ type, title, message }: Props) {
  const accentColor = type === 'success' ? '#2E9C52' : '#D45060';

  return (
    // Ukuran container, posisi, dan rounded
    <div
      className="fixed top-[24px] right-[24px] z-[10000] w-[380px] min-h-[100px] rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{ background: accentColor }}
    >
      {/* Padding, gap, dan inner rounded */}
      <div className="absolute left-[6px] top-0 right-0 bottom-0 bg-white rounded-[12px] flex items-start gap-3 px-4 py-4">
        
        {/* Ukuran wadah ikon dan ikon */}
        <div className="shrink-0 w-[28px] h-[28px] flex items-center justify-center mt-[2px]">
          {type === 'success' ? (
            <CheckCircle2 className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : type === 'delete' ? (
            <Trash2 className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : (
            <AlertTriangle className="w-[28px] h-[28px]" style={{ color: accentColor }} strokeWidth={2} />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-[1px]">
          {/* Ukuran font judul dan deskripsi */}
          <h3 className="text-black font-bold text-[14px] leading-[17px]">{title}</h3>
          <p className="mt-1 text-black/70 text-[12px] leading-[15px]">{message}</p>
        </div>

        {/* Tombol close & icon X DIHAPUS — toast hilang otomatis via setTimeout di parent */}
      </div>
    </div>
  );
}