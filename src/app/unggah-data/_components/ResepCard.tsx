'use client';

import { Flame, Pencil, Trash2, MessageCircle } from 'lucide-react';
import type { Resep } from '../_types';
import { STATUS_RESEP_STYLE } from '../_data';

type Props = {
  resep: Resep;
  onEdit: (resep: Resep) => void;
  onDelete: (resep: Resep) => void;
  onCommentClick: (resep: Resep) => void;
};

export default function ResepCard({ resep, onEdit, onDelete, onCommentClick }: Props) {
  // Kalau Draft, anggap 0 komentar, dan tombol disabled
  const isDraft = resep.status === 'Draft';
  const commentCount = isDraft ? 0 : (resep.commentsCount ?? 0);

  const handleCommentClick = () => {
    if (isDraft) return; // draft tidak bisa dikomentar
    onCommentClick(resep);
  };

  return (
    <div className="bg-white border border-[#8F8F8F] rounded-[11px] overflow-hidden flex flex-col w-full">
      {/* Image + badge usia */}
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
        {/* Nama resep */}
        <p className="text-black font-normal text-[11px] leading-[13px] truncate">
          {resep.nama}
        </p>

        {/* Kalori — rata kanan */}
        <div className="flex items-center justify-end gap-[4px]">
          <Flame className="w-[13px] h-[13px] text-[#FF8F1F]" strokeWidth={0} fill="#FF8F1F" />
          <span className="text-black font-normal text-[11px] leading-[13px]">{resep.kalori} kkal</span>
        </div>

        {/* Status resep */}
        <div>
          <span className={`h-[20px] px-[8px] inline-flex items-center rounded-[5px] font-semibold text-[11px] leading-[13px] ${STATUS_RESEP_STYLE[resep.status]}`}>
            {resep.status}
          </span>
        </div>

        {/* Baris bawah: icon komentar (kiri) + edit/hapus (kanan) */}
        <div className="flex items-center justify-between mt-[2px]">
          {/* Tombol komentar — disabled kalau Draft */}
          <button
            type="button"
            onClick={handleCommentClick}
            disabled={isDraft}
            aria-label={
              isDraft
                ? `Komentar tidak tersedia untuk resep draft`
                : `Lihat komentar ${resep.nama}`
            }
            className={`relative w-[30px] h-[30px] rounded-full flex items-center justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.15)] transition-colors ${
              isDraft
                ? 'bg-[#F5F5F5]/60 cursor-not-allowed opacity-40'
                : 'bg-[#F5F5F5] hover:bg-[#E8E8E8] cursor-pointer'
            }`}
          >
            <MessageCircle
              className={`w-[14px] h-[14px] ${isDraft ? 'text-[#8F8F8F]' : 'text-black'}`}
              strokeWidth={2.2}
            />

            {/* Badge angka komentar — hanya tampil kalau bukan Draft & ada count */}
            {!isDraft && commentCount > 0 && (
              <span className="absolute -top-[3px] -right-[3px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#D45060] text-white font-semibold text-[9px] leading-none flex items-center justify-center">
                {commentCount}
              </span>
            )}
          </button>

          {/* Edit + Hapus */}
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => onEdit(resep)}
              aria-label={`Edit ${resep.nama}`}
              className="cursor-pointer"
            >
              <Pencil className="w-[16px] h-[16px] text-black/70" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(resep)}
              aria-label={`Hapus ${resep.nama}`}
              className="cursor-pointer"
            >
              <Trash2 className="w-[16px] h-[16px] text-[#FF0020]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}