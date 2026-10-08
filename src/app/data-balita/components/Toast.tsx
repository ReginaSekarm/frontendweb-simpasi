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
    <div
      className="fixed top-[40px] right-[40px] z-[10000] w-[578px] h-[154px] rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] animate-[slideIn_0.3s_ease-out]"
      style={{ background: accentColor }}
    >
      <div className="absolute left-[10px] top-0 right-0 bottom-0 bg-white rounded-[20px] flex items-start gap-[16px] px-[20px] py-[28px]">
        <div className="shrink-0 w-[44px] h-[44px] flex items-center justify-center">
          {type === 'success' ? (
            <CheckCircle2 className="w-[44px] h-[44px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : type === 'delete' ? (
            <Trash2 className="w-[44px] h-[44px]" style={{ color: accentColor }} strokeWidth={2} />
          ) : (
            <AlertTriangle className="w-[44px] h-[44px]" style={{ color: accentColor }} strokeWidth={2} />
          )}
        </div>

        <div className="flex-1 min-w-0 pt-[2px]">
          <h3 className="text-black font-bold text-[21.5px] leading-[26px]">{title}</h3>
          <p className="mt-[6px] text-black/70 text-[19px] leading-[24px]">{message}</p>
        </div>
      </div>
    </div>
  );
}