'use client';

import { MessageCircle } from 'lucide-react';
import type { Resep } from '../types';
import { STATUS_RESEP_STYLE } from '../data';

// ================= ICON SVG (dari file edit-pencil.svg, trash-fill.svg & fire_1.svg) =================
// IconEdit & IconTrash: warna mengikuti `currentColor`, diatur lewat class text-*
// IconFire: warna sudah menempel di SVG (3 warna), jadi tidak perlu class text-*

function IconEdit({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 20h16M4 20v-4l8-8M4 20h4l8-8m-4-4l2.869-2.869l.001-.001c.395-.395.593-.593.821-.667a1 1 0 0 1 .618 0c.228.074.425.272.82.666l1.74 1.74c.396.396.594.594.668.822a1 1 0 0 1 0 .618c-.074.228-.272.426-.668.822h0L16 12.001m-4-4l4 4"
      />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="m11.64 14.664l1.5 34.242c.118 2.93 1.876 4.524 4.758 4.524h20.227c2.883 0 4.64-1.594 4.758-4.524l1.5-34.242h2.695c.961 0 1.734-.797 1.734-1.758c0-.96-.773-1.781-1.734-1.781h-9.633V7.773c0-3.21-2.133-5.203-5.156-5.203h-8.625c-3.023 0-5.133 1.993-5.133 5.203v3.352H8.945c-.937 0-1.758.82-1.758 1.781s.82 1.758 1.758 1.758Zm10.079-6.89c0-1.336.984-2.274 2.39-2.274h7.758c1.43 0 2.414.938 2.414 2.273v3.352H21.72Zm13.898 40.874c-.914 0-1.547-.796-1.523-1.757l.96-27.188c.048-.937.727-1.71 1.571-1.71c.867 0 1.57.75 1.547 1.71l-1.055 27.211c-.023 1.008-.633 1.734-1.5 1.734m-15.21 0c-.868 0-1.477-.726-1.5-1.734l-1.055-27.21c-.024-.985.68-1.712 1.546-1.712c.844 0 1.547.774 1.57 1.711l.962 27.188c.023.96-.61 1.757-1.524 1.757m9.21-1.757c0 .96-.75 1.757-1.594 1.757c-.843 0-1.593-.796-1.593-1.757V19.703c0-.937.75-1.71 1.593-1.71c.844 0 1.618.773 1.618 1.71Z"
      />
    </svg>
  );
}

function IconFire({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#FF8F1F"
        d="M266.91 500.44c-168.738 0-213.822-175.898-193.443-291.147c.887-5.016 7.462-6.461 10.327-2.249c8.872 13.04 16.767 31.875 29.848 30.24c19.661-2.458 33.282-175.946 149.807-224.761c3.698-1.549 7.567 1.39 7.161 5.378c-5.762 56.533 28.181 137.468 88.316 137.468c34.472 0 58.058-27.512 69.844-55.142c3.58-8.393 15.843-7.335 17.896 1.556c21.031 91.082 77.25 398.657-179.756 398.657"
      />
      <path
        fill="#FFB636"
        d="M207.756 330.827c3.968-3.334 9.992-1.046 10.893 4.058c2.108 11.943 9.04 32.468 31.778 32.468c27.352 0 45.914-75.264 50.782-97.399c.801-3.642 4.35-6.115 8.004-5.372c68.355 13.898 101.59 235.858-48.703 235.858c-109.412 0-84.625-142.839-52.754-169.613M394.537 90.454c2.409-18.842-31.987 32.693-31.987 32.693s26.223 12.386 31.987-32.693M47.963 371.456c.725-8.021-9.594-29.497-11.421-20.994c-4.373 20.344 10.696 29.016 11.421 20.994"
      />
      <path
        fill="#FFD469"
        d="M323.176 348.596c-2.563-10.69-11.755 14.14-10.6 24.254c1.155 10.113 16.731 1.322 10.6-24.254"
      />
    </svg>
  );
}

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
        {/* PERBAIKAN: Menghapus w-[54.88px] dan menggantinya dengan px-[10px] */}
        <span
          className={`h-[19.76px] px-[10px] inline-flex items-center justify-center rounded-[5.5px] font-semibold text-[11px] leading-[13px] whitespace-nowrap ${STATUS_RESEP_STYLE[resep.status]}`}
        >
          {resep.status}
        </span>

        <div className="flex items-center gap-[4px] pr-[0.6px]">
          {/* 👇 Ikon api dari file fire_1.svg */}
          <IconFire className="w-[13.17px] h-[13.17px] shrink-0" />
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

        {/* Edit + Hapus (Figma: 16.46px, gap ~3px) — ikon dari file SVG */}
        <div className="flex items-center gap-[3.3px]">
          <button
            type="button"
            onClick={() => onEdit(resep)}
            aria-label={`Edit ${resep.nama}`}
            className="cursor-pointer"
          >
            <IconEdit className="w-[16.46px] h-[16.46px] text-black/70" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(resep)}
            aria-label={`Hapus ${resep.nama}`}
            className="cursor-pointer"
          >
            <IconTrash className="w-[16.46px] h-[16.46px] text-[#FF0020]" />
          </button>
        </div>
      </div>
    </div>
  );
}