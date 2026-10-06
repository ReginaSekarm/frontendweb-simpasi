'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';
import type { Resep, KomentarResep } from '../_types';

type Props = {
  resep: Resep;
  komentar: KomentarResep[];
  onClose: () => void;
};

export default function KomentarPanel({ resep, komentar, onClose }: Props) {
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  // State lokal untuk simpan balasan (dummy — hilang saat refresh)
  const [replies, setReplies] = useState<Record<number, string>>({});

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReplies((prev) => ({ ...prev, [id]: replyText.trim() }));
    setReplyText('');
    setReplyOpenId(null);
  };

  return (
    <aside className="w-[460px] shrink-0 bg-white border-l border-[#D9D9D9] flex flex-col h-full">
      {/* Header */}
      <div className="px-[28px] pt-[24px] pb-[20px] border-b border-[#D9D9D9] flex items-start justify-between gap-[16px]">
        <div className="min-w-0">
          <h2 className="text-[24px] font-bold text-black leading-tight">
            Komentar ({komentar.length})
          </h2>
          <p className="mt-[4px] text-[15px] font-semibold text-black/70 truncate">
            {resep.nama}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup komentar"
          className="shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center text-[#8F8F8F] hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-[20px] h-[20px]" strokeWidth={2.4} />
        </button>
      </div>

      {/* List komentar */}
      <div className="flex-1 overflow-y-auto px-[28px] py-[20px] space-y-[14px]">
        {komentar.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-center text-[14px] text-[#797777]">
            Belum ada komentar untuk resep ini.
          </div>
        ) : (
          komentar.map((k) => {
            const isReplying = replyOpenId === k.id;
            const sudahDibalas = !!replies[k.id];

            return (
              <div
                key={k.id}
                className={`rounded-[12px] border bg-white px-[18px] py-[14px] transition-colors ${
                  isReplying ? 'border-[#D45060]' : 'border-[#D9D9D9]'
                }`}
              >
                {/* Header: nama + waktu */}
                <div className="flex items-start justify-between gap-[12px]">
                  <span className="text-[15px] font-bold text-black truncate">{k.nama}</span>
                  <span className="shrink-0 text-[12px] text-[#8F8F8F]">{k.waktu}</span>
                </div>

                {/* Isi komentar */}
                <p className="mt-[8px] text-[14px] leading-[20px] text-black">
                  {k.text}
                </p>

                {/* Balasan yang sudah dikirim */}
                {sudahDibalas && (
                  <div className="mt-[12px] pl-[14px] border-l-[3px] border-[#D45060]">
                    <p className="text-[12px] font-bold text-[#D45060] mb-[4px]">Balasan Anda</p>
                    <p className="text-[13px] leading-[18px] text-black/80">{replies[k.id]}</p>
                  </div>
                )}

                {/* Tombol Balas / Input */}
                {isReplying ? (
                  <div className="mt-[12px] flex items-center gap-[10px] rounded-[10px] border border-[#D45060] px-[14px] py-[10px]">
                    <input
                      type="text"
                      autoFocus
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(k.id);
                      }}
                      placeholder="Tulis balasan..."
                      className="flex-1 text-[14px] text-black placeholder-[#8F8F8F] focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(k.id)}
                      aria-label="Kirim balasan"
                      className="shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center text-[#D45060] hover:bg-[#D45060]/10 transition-colors cursor-pointer"
                    >
                      <Send className="w-[18px] h-[18px]" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyOpenId(k.id);
                      setReplyText('');
                    }}
                    className="mt-[10px] text-[13px] font-semibold text-[#D45060] hover:underline cursor-pointer"
                  >
                    Balas
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}