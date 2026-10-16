'use client';

import { useState } from 'react';
import { Send, X } from 'lucide-react';
import type { Resep, KomentarResep } from '../types';

type Props = {
  resep: Resep;
  komentar: KomentarResep[];
  onClose: () => void;
};

export default function KomentarPanel({ resep, komentar, onClose }: Props) {
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState<Record<number, string>>({});

  const handleSendReply = (id: number) => {
    if (!replyText.trim()) return;
    setReplies((prev) => ({ ...prev, [id]: replyText.trim() }));
    setReplyText('');
    setReplyOpenId(null);
  };

  return (
    // Lebar panel diperkecil dari 460px menjadi 320px
    <aside className="w-[320px] shrink-0 bg-white border-l border-[#D9D9D9] flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-[#D9D9D9] flex items-start justify-between gap-3">
        <div className="min-w-0">
          {/* Font judul dan subtitle diperkecil */}
          <h2 className="text-[16px] font-bold text-black leading-tight">
            Komentar ({komentar.length})
          </h2>
          <p className="mt-0.5 text-[11px] font-semibold text-black/70 truncate">
            {resep.nama}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup komentar"
          // Ukuran tombol close diperkecil
          className="shrink-0 w-[24px] h-[24px] rounded-full flex items-center justify-center text-[#8F8F8F] hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-[14px] h-[14px]" strokeWidth={2.4} />
        </button>
      </div>

      {/* List komentar */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {komentar.length === 0 ? (
          <div className="h-[140px] flex items-center justify-center text-center text-[11px] text-[#797777]">
            Belum ada komentar untuk resep ini.
          </div>
        ) : (
          komentar.map((k) => {
            const isReplying = replyOpenId === k.id;
            const sudahDibalas = !!replies[k.id];

            return (
              <div
                key={k.id}
                //  Padding, radius, dan border diperkecil
                className={`rounded-[8px] border bg-white px-3 py-2.5 transition-colors ${
                  isReplying ? 'border-[#D45060]' : 'border-[#D9D9D9]'
                }`}
              >
                {/* Header: nama + waktu */}
                <div className="flex items-start justify-between gap-2">
                  {/* Font nama dan waktu diperkecil */}
                  <span className="text-[12px] font-bold text-black truncate">{k.nama}</span>
                  <span className="shrink-0 text-[10px] text-[#8F8F8F]">{k.waktu}</span>
                </div>

                {/* Isi komentar */}
                <p className="mt-1.5 text-[11px] leading-[15px] text-black">
                  {k.text}
                </p>

                {/* Balasan yang sudah dikirim */}
                {sudahDibalas && (
                  <div className="mt-2 pl-2.5 border-l-[2px] border-[#D45060]">
                    <p className="text-[10px] font-bold text-[#D45060] mb-0.5">Balasan Anda</p>
                    <p className="text-[11px] leading-[15px] text-black/80">{replies[k.id]}</p>
                  </div>
                )}

                {/* Tombol Balas / Input */}
                {isReplying ? (
                  <div className="mt-2 flex items-center gap-2 rounded-[8px] border border-[#D45060] px-2.5 py-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReply(k.id);
                      }}
                      placeholder="Tulis balasan..."
                      className="flex-1 text-[11px] text-black placeholder-[#8F8F8F] focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendReply(k.id)}
                      aria-label="Kirim balasan"
                      //  Tombol kirim diperkecil
                      className="shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[#D45060] hover:bg-[#D45060]/10 transition-colors cursor-pointer"
                    >
                      <Send className="w-[13px] h-[13px]" strokeWidth={2} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setReplyOpenId(k.id);
                      setReplyText('');
                    }}
                    //  Font tombol balas diperkecil
                    className="mt-1.5 text-[11px] font-semibold text-[#D45060] hover:underline cursor-pointer"
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