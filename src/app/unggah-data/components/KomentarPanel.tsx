'use client';

import { useState, useEffect } from 'react';
import { Send, X, ChevronDown, ChevronUp, MoreHorizontal, User } from 'lucide-react';
import type { Resep } from '../types';
import { api } from '../../../lib/api';
import { getToken, decodeToken } from '../../../lib/auth';
import { useProfilFoto } from '../../../components/profilFoto';

// ================= TYPES =================
type Reply = {
  id: number;
  userId: number;
  nama: string;
  waktu: string;
  text: string;
};

type KomentarData = Reply & {
  replyCount: number;
  replies: Reply[];
  repliesLoaded: boolean;
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
  onClose: () => void;
  // Tidak dipakai lagi (panel mengambil data komentar sendiri dari backend); dibiarkan opsional agar kompatibel
  komentar?: unknown;
};

// ================= HELPER =================
const toList = (res: any): any[] =>
  Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];

// Detik sejak komentar dibuat -> "Baru saja", "5 menit", "20 jam", "1 hari", dst.
const formatWaktu = (ageSeconds: unknown, createdAt?: string): string => {
  let s = Number(ageSeconds);
  if (!Number.isFinite(s)) {
    const t = createdAt ? new Date(createdAt).getTime() : NaN;
    s = Number.isNaN(t) ? 0 : Math.max(0, (Date.now() - t) / 1000);
  }
  if (s < 60) return 'Baru saja';
  const menit = Math.floor(s / 60);
  if (menit < 60) return `${menit} menit`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} jam`;
  const hari = Math.floor(jam / 24);
  if (hari < 30) return `${hari} hari`;
  const bulan = Math.floor(hari / 30);
  if (bulan < 12) return `${bulan} bulan`;
  return `${Math.floor(bulan / 12)} tahun`;
};

const mapReply = (c: any): Reply => ({
  id: Number(c.id),
  userId: Number(c.user_id),
  nama: String(c.user_name || c.full_name || 'Pengguna'),
  waktu: formatWaktu(c.age_seconds, c.created_at),
  text: String(c.content ?? ''),
});

const mapKomentar = (c: any): KomentarData => ({
  ...mapReply(c),
  replyCount: Number(c.reply_count) || 0,
  replies: [],
  repliesLoaded: false,
});

const namaDepan = (nama: string): string => nama.trim().split(/\s+/)[0] || nama;

// ================= AVATAR =================
function Avatar({ size, foto }: { size: number; foto?: string }) {
  const [gagal, setGagal] = useState(false);

  if (foto && !gagal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={foto}
        alt="Foto profil"
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover bg-[#D9D9D9]"
        onError={() => setGagal(true)}
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
  const rowBase =
    'w-full h-[60px] flex items-center justify-center text-[18px] leading-[29px] font-normal cursor-pointer transition-colors hover:bg-black/[0.03]';
  const divider = <div style={{ borderTop: '2.39px solid #D9D9D9' }} />;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white overflow-hidden shadow-lg"
        style={{ width: '380px', maxWidth: '100%', borderRadius: '23.92px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button type="button" onClick={onDelete} className={rowBase} style={{ color: '#FF0020' }}>
          Hapus
        </button>
        {divider}
        {isOwn && (
          <>
            <button type="button" onClick={onEdit} className={rowBase} style={{ color: '#000000' }}>
              Edit
            </button>
            {divider}
          </>
        )}
        <button type="button" onClick={onCancel} className={rowBase} style={{ color: '#000000' }}>
          Batal
        </button>
      </div>
    </div>
  );
}

export default function KomentarPanel({ resep, onClose }: Props) {
  const fotoProfil = useProfilFoto();

  // id akun yang sedang login (untuk menentukan komentar milik sendiri)
  const [myId, setMyId] = useState<number | null>(null);
  useEffect(() => {
    const p: any = decodeToken(getToken());
    setMyId(Number(p?.id ?? p?.userId ?? p?.user_id) || null);
  }, []);

  const [komentar, setKomentar] = useState<KomentarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const [activeTab, setActiveTab] = useState<'semua' | 'belum_dibalas'>('semua');
  const [expandedThreads, setExpandedThreads] = useState<Record<number, boolean>>({});
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const [menuTarget, setMenuTarget] = useState<MenuTarget>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editText, setEditText] = useState('');

  const isMine = (userId: number) => myId !== null && userId === myId;

  // ---------- Ambil komentar resep ini dari backend ----------
  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError('');
    setKomentar([]);

    (async () => {
      try {
        const res = await api<any>(`/recipes/${resep.id}/comments`);
        if (batal) return;
        setKomentar(toList(res).map(mapKomentar));
      } catch (err: any) {
        if (batal) return;
        setError(err?.message || 'Gagal memuat komentar.');
      } finally {
        if (!batal) setLoading(false);
      }
    })();

    return () => {
      batal = true;
    };
  }, [resep.id]);

  // ---------- Ambil balasan satu komentar ----------
  const loadReplies = async (komentarId: number) => {
    try {
      const res = await api<any>(`/comments/${komentarId}/replies`);
      const replies = toList(res).map(mapReply);
      setKomentar((prev) =>
        prev.map((k) =>
          k.id === komentarId
            ? { ...k, replies, replyCount: replies.length, repliesLoaded: true }
            : k
        )
      );
    } catch (err: any) {
      setError(err?.message || 'Gagal memuat balasan.');
    }
  };

  const toggleThread = async (id: number) => {
    const k = komentar.find((x) => x.id === id);
    const sedangTerbuka = !!expandedThreads[id];
    setExpandedThreads((prev) => ({ ...prev, [id]: !sedangTerbuka }));
    if (!sedangTerbuka && k && !k.repliesLoaded) {
      await loadReplies(id);
    }
  };

  // ---------- Kirim balasan ----------
  const handleSendReply = async (komentarId: number) => {
    const text = replyText.trim();
    if (!text || sending) return;

    setSending(true);
    setError('');
    try {
      await api(`/comments/${komentarId}/reply`, {
        method: 'POST',
        body: { content: text },
      });
      setReplyText('');
      setReplyOpenId(null);
      await loadReplies(komentarId);
      setExpandedThreads((prev) => ({ ...prev, [komentarId]: true }));
    } catch (err: any) {
      setError(err?.message || 'Gagal mengirim balasan.');
    } finally {
      setSending(false);
    }
  };

  // ---------- Triple dot: buka popup ----------
  const openMenu = (komentarId: number, userId: number, replyId?: number) => {
    setMenuTarget({ komentarId, replyId, isOwn: isMine(userId) });
  };

  // ---------- Hapus ----------
  const handleDelete = async () => {
    if (!menuTarget) return;
    const { komentarId, replyId } = menuTarget;
    setMenuTarget(null);
    setError('');

    try {
      await api(`/comments/${replyId ?? komentarId}`, { method: 'DELETE' });
      setKomentar((prev) =>
        replyId === undefined
          ? prev.filter((k) => k.id !== komentarId)
          : prev.map((k) =>
              k.id !== komentarId
                ? k
                : {
                    ...k,
                    replies: k.replies.filter((r) => r.id !== replyId),
                    replyCount: Math.max(0, k.replyCount - 1),
                  }
            )
      );
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus komentar.');
    }
  };

  // ---------- Edit ----------
  const handleStartEdit = () => {
    if (!menuTarget) return;
    const { komentarId, replyId } = menuTarget;
    const k = komentar.find((x) => x.id === komentarId);
    const current =
      replyId === undefined ? k?.text : k?.replies.find((r) => r.id === replyId)?.text;

    setEditText(current ?? '');
    setEditTarget({ komentarId, replyId });
    setMenuTarget(null);
  };

  const handleSaveEdit = async () => {
    const text = editText.trim();
    if (!editTarget || !text) return;
    const { komentarId, replyId } = editTarget;
    setError('');

    try {
      await api(`/comments/${replyId ?? komentarId}`, {
        method: 'PUT',
        body: { content: text },
      });
      setKomentar((prev) =>
        prev.map((k) => {
          if (k.id !== komentarId) return k;
          if (replyId === undefined) return { ...k, text };
          return {
            ...k,
            replies: k.replies.map((r) => (r.id === replyId ? { ...r, text } : r)),
          };
        })
      );
      setEditTarget(null);
      setEditText('');
    } catch (err: any) {
      setError(err?.message || 'Gagal menyimpan perubahan.');
    }
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

  // "Belum dibalas" = komentar yang belum punya balasan sama sekali
  const filteredKomentar = komentar.filter((k) => {
    if (activeTab === 'belum_dibalas') return k.replyCount === 0;
    return true;
  });

  const countBelumDibalas = komentar.filter((k) => k.replyCount === 0).length;

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
          className="mt-3 flex gap-4 relative"
          style={{ borderBottom: '1px solid rgba(143,143,143,0.8)' }}
        >
          <button
            onClick={() => setActiveTab('semua')}
            className={`pb-2 text-[12px] font-semibold cursor-pointer transition-colors ${
              activeTab === 'semua' ? 'text-black' : 'text-[#797777]'
            }`}
            style={{
              marginBottom: '-1px',
              borderBottom: activeTab === 'semua' ? '2px solid #D45060' : '2px solid transparent',
            }}
          >
            Semua ({komentar.length})
          </button>
          <button
            onClick={() => setActiveTab('belum_dibalas')}
            className={`pb-2 text-[12px] font-semibold cursor-pointer transition-colors ${
              activeTab === 'belum_dibalas' ? 'text-black' : 'text-[#797777]'
            }`}
            style={{
              marginBottom: '-1px',
              borderBottom:
                activeTab === 'belum_dibalas' ? '2px solid #D45060' : '2px solid transparent',
            }}
          >
            Belum dibalas ({countBelumDibalas})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {error && (
          <div className="rounded-[8px] bg-[#F88B92]/20 border border-[#D45060]/40 px-2.5 py-1.5 text-[11px] font-medium text-[#D45060]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-full flex items-center justify-center pb-10">
            <p className="text-[11px] font-semibold text-[#797777]">Memuat komentar...</p>
          </div>
        ) : komentar.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-1 pb-10">
            <p className="text-[12px] font-semibold text-black text-center">Belum ada komentar</p>
            <p className="text-[11px] text-[#797777] text-center max-w-[220px]">
              Komentar dari pengguna untuk resep ini akan muncul di sini.
            </p>
          </div>
        ) : activeTab === 'belum_dibalas' && filteredKomentar.length === 0 ? (
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
            <div
              key={k.id}
              className="flex flex-col gap-1.5 pb-3 border-b border-[rgba(143,143,143,0.8)] last:border-b-0"
            >
              <div className="flex gap-2">
                <Avatar size={28} foto={isMine(k.userId) ? fotoProfil : undefined} />

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[12px] font-bold text-black truncate">{k.nama}</span>
                      <MetaRow waktu={k.waktu} isCreator={isMine(k.userId)} fontSize={10} />
                    </div>
                    <button
                      type="button"
                      onClick={() => openMenu(k.id, k.userId)}
                      aria-label="Menu komentar"
                      className="shrink-0 w-[20px] h-[20px] rounded-full flex items-center justify-center text-black hover:bg-black/5 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-[14px] h-[14px]" strokeWidth={2.4} />
                    </button>
                  </div>

                  {isEditing(k.id) ? (
                    renderEditForm()
                  ) : (
                    <CommentText text={k.text} className="text-[11px] text-black leading-[15px] mb-1.5" />
                  )}

                  <div className="flex items-center gap-3">
                    {k.replyCount > 0 && (
                      <button
                        onClick={() => toggleThread(k.id)}
                        className="flex items-center gap-1 text-[10px] font-semibold text-[#797777] cursor-pointer"
                      >
                        {expandedThreads[k.id] ? (
                          <ChevronUp size={12} strokeWidth={3} />
                        ) : (
                          <ChevronDown size={12} strokeWidth={3} />
                        )}
                        {expandedThreads[k.id] ? 'Sembunyikan balasan' : `${k.replyCount} balasan`}
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
                          <Avatar size={24} foto={isMine(reply.userId) ? fotoProfil : undefined} />

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-[11px] font-semibold text-black truncate">
                                  {reply.nama}
                                </span>
                                <MetaRow
                                  waktu={reply.waktu}
                                  isCreator={isMine(reply.userId)}
                                  fontSize={9}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => openMenu(k.id, reply.userId, reply.id)}
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

                            {/* Balasan hanya 1 tingkat (aturan backend): membalas balasan = membalas komentar induknya dengan tag @nama */}
                            <button
                              onClick={() => {
                                setReplyOpenId(k.id);
                                setReplyText(`@${namaDepan(reply.nama)} `);
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
                    maxLength={500}
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
                    disabled={sending}
                    aria-label="Kirim balasan"
                    className="shrink-0 p-0.5 text-[#D45060] hover:bg-[#D45060]/10 rounded-full transition-colors cursor-pointer disabled:opacity-50"
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