'use client';

import { Flame, Pencil, Trash2, MessageCircle } from 'lucide-react';
import type { Resep } from '../types';
import { STATUS_RESEP_STYLE } from '../data';

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
    // Figma: 158.05 x 243.67, border 1.1px #8F8F8F, radius 11
    <div className="bg-white border-[1.1px] border-[#8F8F8F] rounded-[11px] overflow-hidden flex flex-col w-full max-w-[158px] px-[11px] pt-[15px] pb-[8.5px]">
      {/* Image + badge usia (Figma: 137.2 x 135, radius 11) */}
      <div className="relative w-full aspect-[137.2/135] bg-[#D9D9D9] rounded-[11px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resep.image}
          alt={resep.nama}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="absolute top-[7.7px] left-[8.8px] h-[17.56px] min-w-[67px] px-[10px] bg-[#FFB636] rounded-full text-white font-normal text-[11px] leading-[13px] flex items-center justify-center whitespace-nowrap">
          {resep.usia}
        </span>
      </div>

      {/* Nama resep (Figma: 11px, jarak ~9px dari gambar) */}
      <p className="mt-[8.8px] px-[4.4px] text-black font-normal text-[11px] leading-[13px] truncate">
        {resep.nama}
      </p>

      {/* Status (kiri) + kalori (kanan) */}
      <div className="mt-[6.2px] flex items-center justify-between">
        <span
          className={`h-[19.76px] w-[54.88px] inline-flex items-center justify-center rounded-[5.5px] font-semibold text-[11px] leading-[13px] ${STATUS_RESEP_STYLE[resep.status]}`}
        >
          {resep.status}
        </span>

        <div className="flex items-center gap-[4px] pr-[0.6px]">
          <Flame className="w-[13.17px] h-[13.17px] text-[#FF8F1F]" strokeWidth={0} fill="#FF8F1F" />
          <span className="text-black font-normal text-[11px] leading-[13px] whitespace-nowrap">
            {resep.kalori} kkal
          </span>
        </div>
      </div>

      {/* Baris bawah: komentar (kiri) + edit/hapus (kanan) */}
      <div className="mt-[7px] flex items-end justify-between">
        {/* Tombol komentar 30x30, shadow 0 4 4 rgba(0,0,0,.25) */}
        <button
          type="button"
          onClick={handleCommentClick}
          disabled={isDraft}
          aria-label={
            isDraft
              ? `Komentar tidak tersedia untuk resep draft`
              : `Lihat komentar ${resep.nama}`
          }
          className={`relative w-[30px] h-[30px] rounded-full flex items-center justify-center shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-colors ${
            isDraft
              ? 'bg-[#F5F5F5]/60 cursor-not-allowed opacity-40'
              : 'bg-[#F5F5F5] hover:bg-[#E8E8E8] cursor-pointer'
          }`}
        >
          <MessageCircle
            className={`w-[14.29px] h-[14.29px] ${isDraft ? 'text-[#8F8F8F]' : 'text-black'}`}
            strokeWidth={2.2}
          />

          {/* Badge angka komentar — hanya tampil kalau bukan Draft & ada count */}
          {!isDraft && commentCount > 0 && (
            <span className="absolute -top-[3px] -right-[3px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#D45060] text-white font-semibold text-[9px] leading-none flex items-center justify-center">
              {commentCount}
            </span>
          )}
        </button>

        {/* Edit + Hapus (Figma: 16.46px, gap ~3px) */}
        <div className="flex items-center gap-[3.3px]">
          <button
            type="button"
            onClick={() => onEdit(resep)}
            aria-label={`Edit ${resep.nama}`}
            className="cursor-pointer"
          >
            <Pencil className="w-[16.46px] h-[16.46px] text-black/70" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(resep)}
            aria-label={`Hapus ${resep.nama}`}
            className="cursor-pointer"
          >
            <Trash2 className="w-[16.46px] h-[16.46px] text-[#FF0020]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}