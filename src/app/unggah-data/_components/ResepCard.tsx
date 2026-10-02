'use client';

import { Flame, Pencil, Trash2 } from 'lucide-react';
import type { Resep } from '../_types';
import { STATUS_RESEP_STYLE } from '../_data';

type Props = {
  resep: Resep;
  onEdit: (resep: Resep) => void;
  onDelete: (resep: Resep) => void;
};

export default function ResepCard({ resep, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-[#8F8F8F]/60 rounded-[11px] overflow-hidden flex flex-col w-full">
      <div className="relative w-full aspect-square bg-[#D9D9D9] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resep.image}
          alt={resep.nama}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="absolute top-[8px] left-[8px] h-[18px] px-[9px] bg-[#FFB636] rounded-full text-white font-normal text-[11px] leading-[13px] flex items-center">
          {resep.usia}
        </span>
      </div>

      <div className="px-[12px] pt-[9px] pb-[10px] flex flex-col gap-[6px]">
        <p className="text-black font-normal text-[11px] leading-[13px] truncate">{resep.nama}</p>

        <div className="flex items-center justify-end gap-[4px]">
          <Flame className="w-[13px] h-[13px] text-[#FF8F1F]" strokeWidth={0} fill="#FF8F1F" />
          <span className="text-black font-normal text-[11px] leading-[13px]">{resep.kalori} kkal</span>
        </div>

        <div className="flex items-center justify-between mt-[2px]">
          <span className={`h-[20px] px-[8px] flex items-center rounded-[5px] font-semibold text-[11px] leading-[13px] ${STATUS_RESEP_STYLE[resep.status]}`}>
            {resep.status}
          </span>

          <div className="flex items-center gap-[8px]">
            <button type="button" onClick={() => onEdit(resep)} aria-label={`Edit ${resep.nama}`} className="cursor-pointer">
              <Pencil className="w-[16px] h-[16px] text-black/70" strokeWidth={2} />
            </button>
            <button type="button" onClick={() => onDelete(resep)} aria-label={`Hapus ${resep.nama}`} className="cursor-pointer">
              <Trash2 className="w-[16px] h-[16px] text-[#FF0020]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}