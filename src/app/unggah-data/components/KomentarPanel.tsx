'use client';

import { useState } from 'react';
import { Send, X, ChevronDown, ChevronUp, MoreHorizontal, User } from 'lucide-react';
import type { Resep, KomentarResep } from '../types';

// Nama akun kader yang sedang login (komentar miliknya bisa di-Edit)
const KADER_NAME = 'Siti Amaliah';
const KADER_AVATAR = '/images/profil-kader.png';

// Tipe data untuk mendukung balasan bersarang
type Reply = {
  id: number;
  nama: string;
  waktu: string;
  text: string;
};

type KomentarData = {
  id: number;
  nama: string;
  waktu: string;
  text: string;
  replies: Reply[];
  isReplied?: boolean;
};

type MenuTarget = {
  komentarId: number;
  replyId?: number;
  isOwn: boolean;
} | null;

type EditTarget = {
  komentarId: number;
  replyId?: number;
} | null;

type Props = {
  resep: Resep;
  komentar: KomentarResep[];
  onClose: () => void;
};

// ================= AVATAR =================
function Avatar({ nama, size }: { nama: string; size: number }) {
  if (nama === KADER_NAME) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={KADER_AVATAR}
        alt={nama}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover bg-[#D9D9D9]"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full bg-black flex items-center justify-center"
    >
      <User
        style={{ width: size * 0.55, height: size * 0.55 }}
        className="text-white"
        fill="currentColor"
        strokeWidth={1.5}
      />
    </div>
  );
}

// ================= WAKTU • PEMBUAT =================
function MetaRow({
  waktu,
  isCreator,
  fontSize,
}: {
  waktu: string;
  isCreator: boolean;
  fontSize: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      <span style={{ fontSize, lineHeight: 1, color: '#8F8F8F' }}>
        {waktu}
      </span>
      {isCreator && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '2px',
              height: '2px',
              minWidth: '2px',
              minHeight: '2px',
              borderRadius: '50%',
              backgroundColor: '#797777',
              margin: '0 4px',
            }}
          />
          <span style={{ fontSize, lineHeight: 1, color: '#8F8F8F' }}>
            Pembuat
          </span>
        </div>
      )}
    </div>
  );
}

// ================= TEKS (tag @nama berwarna biru) =================
function CommentText({ text, className }: { text: string; className: string }) {
  const m = text.match(/^(@\S+)(\s[\s\S]*)?$/);
  if (m) {
    return (
      <p className={className}>
        <span className="text-[#006199]">{m[1]}</span>
        {m[2]}
      </p>
    );
  }
  return <p className={className}>{text}</p>;
}

// ================= POPUP TRIPLE DOT =================
function ActionPopup({
  isOwn,
  onDelete,
  onEdit,
  onCancel,
}: {
  isOwn: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  // Tinggi baris: popup 2 opsi (127px) / 3 opsi (208px)
  const rowH = isOwn ? 'h-[67px]' : 'h-[62px]';
  const rowBase = `w-full ${rowH} flex items-center justify-center text-[24px] leading-[29px] font-normal cursor-pointer transition-colors hover:bg-black/[0.03]`;
  const divider = (
    <div
      className="h-0 border-t-[2.39px] border-[#D9D9D9]"
      style={{ borderTop: '2.39px solid #D9D9D9' }}
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(0px)',
        WebkitBackdropFilter: 'blur(0px)',
      }}
      onClick={onCancel}
    >
      <div
        className="w-[415px] max-w-full bg-white rounded-[23.92px] overflow-hidden shadow-lg"
        style={{
          width: '380px',
          maxWidth: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '23.92px',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onDelete}
          className={`${rowBase} text-[#FF0020]`}
          style={{
            height: isOwn ? '60px' : '60px',
            color: '#FF0020',
            fontSize: '18px',
          }}
        >
          Hapus
        </button>
        {divider}
        {isOwn && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className={`${rowBase} text-black`}
              style={{
                height: '60px',
                color: '#000000',
                fontSize: '18px',
              }}
            >
              Edit
            </button>
            {divider}
          </>
        )}
        <button
          type="button"
          onClick={onCancel}
          className={`${rowBase} text-black`}
          style={{
            height: isOwn ? '60px' : '60px',
            color: '#000000',
            fontSize: '18px',
          }}
        >
          Batal
        </button>
      </div>
    </div>
  );
}

export default function KomentarPanel({ resep, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'semua' | 'belum_dibalas'>('semua');
  const [expandedThreads, setExpandedThreads] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
  });
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const [menuTarget, setMenuTarget] = useState<MenuTarget>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editText, setEditText] = useState('');

  // Data dummy
  const [komentar, setKomentar] = useState<KomentarData[]>([
    {
      id: 1,
      nama: 'Wowo',
      waktu: '1 hari',
      text: 'Sebelum dihaluskan, ubi ungu perlu didiamkan sampai dingin dulu atau langsung dihaluskan selagi panas?',
      replies: [
        {
          id: 101,
          nama: KADER_NAME,
          waktu: '20 jam',
          text: '@Wowo Sebaiknya langsung di haluskan ya bunda selagi ubi ungunya masih panas.',
        },
      ],
      isReplied: true,
    },
    {
      id: 2,
      nama: 'Uni',
      waktu: '1 hari',
      text: 'Dirumah cuma ada kimpul, ubi ungu nya bisa diganti kimpul aja ga bun?Tolong dijawab ya',
      replies: [
        {
          id: 201,
          nama: 'Aisyah',
          waktu: '20 jam',
          text: '@Uni Bisa banget bun, kimpul teksturnya mirip ubi ungu. Kukus dulu ya sebelum dihaluskan.',
        },
        {
          id: 202,
          nama: 'Uni',
          waktu: '18 jam',
          text: '@Aisyah Oke bun, makasih infonya 🙏',
        },
      ],
      isReplied: true,
    },
  ]);

  const handleSendReply = (komentarId: number) => {
    if (!replyText.trim()) return;

    setKomentar((prev) =>
      prev.map((k) => {
        if (k.id === komentarId) {
          return {
            ...k,
            isReplied: true,
            replies: [
              ...k.replies,
              {
                id: Date.now(),
                nama: KADER_NAME,
                waktu: 'Baru saja',
                text: replyText.trim(),
              },
            ],
          };
        }
        return k;
      })
    );

    setReplyText('');
    setReplyOpenId(null);
    setExpandedThreads((prev) => ({ ...prev, [komentarId]: true }));
  };

  const toggleThread = (id: number) => {
    setExpandedThreads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ---------- Triple dot: buka popup ----------
  // Logika isOwn di sini otomatis membedakan user biasa dan admin (KADER_NAME)
  const openMenu = (komentarId: number, nama: string, replyId?: number) => {
    setMenuTarget({ komentarId, replyId, isOwn: nama === KADER_NAME });
  };

  const handleDelete = () => {
    if (!menuTarget) return;
    const { komentarId, replyId } = menuTarget;

    setKomentar((prev) =>
      replyId === undefined
        ? prev.filter((k) => k.id !== komentarId)
        : prev.map((k) => {
            if (k.id !== komentarId) return k;
            const replies = k.replies.filter((r) => r.id !== replyId);
            return { ...k, replies, isReplied: replies.length > 0 };
          })
    );
    setMenuTarget(null);
  };

  const handleStartEdit = () => {
    if (!menuTarget) return;
    const { komentarId, replyId } = menuTarget;
    const k = komentar.find((x) => x.id === komentarId);
    const current =
      replyId === undefined
        ? k?.text
        : k?.replies.find((r) => r.id === replyId)?.text;

    setEditText(current ?? '');
    setEditTarget({ komentarId, replyId });
    setMenuTarget(null);
  };

  const handleSaveEdit = () => {
    if (!editTarget || !editText.trim()) return;
    const { komentarId, replyId } = editTarget;

    setKomentar((prev) =>
      prev.map((k) => {
        if (k.id !== komentarId) return k;
        if (replyId === undefined) return { ...k, text: editText.trim() };
        return {
          ...k,
          replies: k.replies.map((r) =>
            r.id === replyId ? { ...r, text: editText.trim() } : r
          ),
        };
      })
    );
    setEditTarget(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditTarget(null);
    setEditText('');
  };

  const isEditing = (komentarId: number, replyId?: number) =>
    editTarget?.komentarId === komentarId && editTarget?.replyId === replyId;

  const renderEditForm = () => (
    <div className="mt-0.5">
      <textarea
        autoFocus
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        rows={3}
        className="w-full rounded-[8px] border border-[#D45060] px-2.5 py-1.5 text-[11px] text-black leading-[15px] focus:outline-none resize-none bg-white"
      />
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSaveEdit}
          className="text-[10px] font-bold text-[#D45060] cursor-pointer"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="text-[10px] font-semibold text-[#8F8F8F] cursor-pointer"
        >
          Batal
        </button>
      </div>
    </div>
  );

  const filteredKomentar = komentar.filter((k) => {
    if (activeTab === 'belum_dibalas') return !k.isReplied;
    return true;
  });

  const countBelumDibalas = komentar.filter((k) => !k.isReplied).length;

  return (
    <aside className="w-[320px] shrink-0 bg-white border-l border-[#D9D9D9] flex flex-col h-full font-sans">
      
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-[16px] font-bold text-black leading-tight shrink-0">
              Komentar
            </h2>
            <p className="text-[11px] font-semibold text-[#797777] truncate mt-[2px]">
              {resep.nama}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup komentar"
            className="shrink-0 mt-0.5 w-[24px] h-[24px] rounded-full flex items-center justify-center text-[#8F8F8F] hover:text-black hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-[14px] h-[14px]" strokeWidth={2.4} />
          </button>
        </div>

        <div
          className="mt-3 flex gap-4 relative border-b border-[rgba(143,143,143,0.8)]"
          style={{ borderBottom: '1px solid rgba(143,143,143,0.8)' }}
        >
          <button
            onClick={() => setActiveTab('semua')}
            className={`pb-2 -mb-[1px] text-[12px] font-semibold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'semua'
                ? 'text-black border-[#D45060]'
                : 'text-[#797777] border-transparent'
            }`}
            style={{
              marginBottom: '-1px',
              borderBottom:
                activeTab === 'semua'
                  ? '2px solid #D45060'
                  : '2px solid transparent',
            }}
          >
            Semua ({komentar.length})
          </button>
          <button
            onClick={() => setActiveTab('belum_dibalas')}
            className={`pb-2 -mb-[1px] text-[12px] font-semibold cursor-pointer transition-colors border-b-2 ${
              activeTab === 'belum_dibalas'
                ? 'text-black border-[#D45060]'
                : 'text-[#797777] border-transparent'
            }`}
            style={{
              marginBottom: '-1px',
              borderBottom:
                activeTab === 'belum_dibalas'
                  ? '2px solid #D45060'
                  : '2px solid transparent',
            }}
          >
            Belum dibalas ({countBelumDibalas})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {activeTab === 'belum_dibalas' && filteredKomentar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 pb-10">
            <p className="text-[11px] font-semibold text-black text-center">
              Semua komentar sudah di balas
            </p>
            <button
              onClick={() => setActiveTab('semua')}
              className="text-[11px] font-bold text-[#D45060] hover:underline cursor-pointer"
            >
              Lihat semua komentar
            </button>
          </div>
        ) : (
          filteredKomentar.map((k) => (
            <div key={k.id} className="flex flex-col gap-1.5 pb-3 border-b border-[rgba(143,143,143,0.8)] last:border-b-0">
              <div className="flex gap-2">
                <Avatar nama={k.nama} size={28} />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-bold text-black truncate">{k.nama}</span>
                      <MetaRow
                        waktu={k.waktu}
                        isCreator={k.nama === KADER_NAME}
                        fontSize={10}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => openMenu(k.id, k.nama)}
                      aria-label="Menu komentar"
                      className="shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-black hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-[14px] h-[14px]" strokeWidth={2.4} />
                    </button>
                  </div>

                  {isEditing(k.id) ? (
                    renderEditForm()
                  ) : (
                    <CommentText
                      text={k.text}
                      className="text-[11px] text-black leading-[15px] mb-1.5"
                    />
                  )}

                  <div className="flex items-center gap-3">
                    {k.replies.length > 0 && (
                      <button
                        onClick={() => toggleThread(k.id)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#797777] cursor-pointer"
                      >
                        {expandedThreads[k.id] ? (
                          <ChevronUp size={12} strokeWidth={3} />
                        ) : (
                          <ChevronDown size={12} strokeWidth={3} />
                        )}
                        {expandedThreads[k.id]
                          ? 'Sembunyikan balasan'
                          : `${k.replies.length} balasan`}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setReplyOpenId(k.id);
                        setReplyText('');
                      }}
                      className="text-[10px] font-semibold text-[#797777] cursor-pointer"
                    >
                      Balas
                    </button>
                  </div>

                  {expandedThreads[k.id] && k.replies.length > 0 && (
                    <div
                      className="mt-3 flex flex-col gap-3"
                      style={{
                        marginLeft: 6,
                        paddingLeft: 12,
                        borderLeft: '1.5px solid rgba(143,143,143,0.8)',
                      }}
                    >
                      {k.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar nama={reply.nama} size={24} />

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-[11px] font-semibold text-black truncate">
                                  {reply.nama}
                                </span>
                                <MetaRow
                                  waktu={reply.waktu}
                                  isCreator={reply.nama === KADER_NAME}
                                  fontSize={9}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => openMenu(k.id, reply.nama, reply.id)}
                                aria-label="Menu balasan"
                                className="shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center text-black hover:bg-black/5 transition-colors cursor-pointer"
                              >
                                <MoreHorizontal className="w-[12px] h-[12px]" strokeWidth={2.4} />
                              </button>
                            </div>

                            {isEditing(k.id, reply.id) ? (
                              renderEditForm()
                            ) : (
                              <CommentText
                                text={reply.text}
                                className="text-[10px] text-black leading-[14px] mb-0.5"
                              />
                            )}

                            <button
                              onClick={() => {
                                setReplyOpenId(k.id);
                                setReplyText('');
                              }}
                              className="text-[10px] text-[#8F8F8F] hover:text-[#D45060] cursor-pointer"
                            >
                              Balas
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {replyOpenId === k.id && (
                <div className="mt-1 flex items-center gap-1.5 rounded-[8px] border border-[#D45060] px-2.5 py-1.5 bg-white w-full">
                  <input
                    type="text"
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply(k.id);
                    }}
                    placeholder="Tulis balasan..."
                    className="flex-1 text-[11px] text-black placeholder-black focus:outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendReply(k.id)}
                    aria-label="Kirim balasan"
                    className="shrink-0 p-0.5 text-[#D45060] hover:bg-[#D45060]/10 rounded-full transition-colors cursor-pointer"
                  >
                    <Send className="w-[14px] h-[14px]" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {menuTarget && (
        <ActionPopup
          isOwn={menuTarget.isOwn}
          onDelete={handleDelete}
          onEdit={handleStartEdit}
          onCancel={() => setMenuTarget(null)}
        />
      )}
    </aside>
  );
}