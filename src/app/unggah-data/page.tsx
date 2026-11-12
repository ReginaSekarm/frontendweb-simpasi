'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ChevronRight, FileText, Upload, ChefHat } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AuthGuard from '../../components/AuthGuard';

import type { FilterResepType, Resep, StatusResepType, ToastState } from './types';
import { KONDISI_STYLE } from './data';
import type { KondisiType } from './types';

import Toast from './components/Toast';
import TambahResepModal from './components/TambahResepModal';
import PemeriksaanModal from './components/PemeriksaanModal';
import ResepCard from './components/ResepCard';
import KomentarPanel from './components/KomentarPanel';
import SearchInput from './components/SearchInput';
import FilterTabs from './components/FilterTabs';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

import { usePemeriksaanForm } from './hooks/usePemeriksaanForm';
import { api } from '../../lib/api';

// ================= FOTO PLACEHOLDER =================
// Foto lama berupa path lokal (/images/recipes/...) tidak ada di folder public,
// jadi diganti placeholder supaya tidak muncul error 404 di Console.
const FOTO_KOSONG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#FCEBD5"/><text x="50%" y="50%" fill="#D45060" font-size="14" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">Belum ada foto</text></svg>'
  );

// Hanya URL hasil unggahan (https) yang dipakai; selain itu tampilkan placeholder
const pakaiFoto = (url: unknown): string =>
  typeof url === 'string' && url.startsWith('https://') ? url : FOTO_KOSONG;

// ================= USIA =================
// Usia: nilai di backend -> tulisan di form.
// Samakan tulisannya dengan teks tombol usia di TambahResepModal.
const USIA_DARI_API: Record<string, string> = {
  '6': '6 Bulan',
  '7-8': '7 - 8 Bulan',
  '9-11': '9 - 11 Bulan',
  '12+': '12 Bulan +',
};

// Tulisan di form -> nilai di backend, diambil dari angka pertama ("9 - 11 Bulan" -> "9-11")
const usiaKeApi = (label: unknown): string => {
  const first = parseInt(String(label ?? ''), 10);
  if (first >= 12) return '12+';
  if (first >= 9) return '9-11';
  if (first >= 7) return '7-8';
  return '6';
};

// ================= EMPTY STATE =================
const ICON_CLASS = 'w-[40px] h-[40px] text-[#D45060]/80';

const NotebookPlusIcon = (
  <svg
    className={ICON_CLASS}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M20 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2H3v-2h2v-2H3v-2h2v-2H3V9h2V7H3V5h2V3a1 1 0 0 1 1-1zm-1 2H7v16h12zm-5 4v3h3v2h-3.001L14 16h-2l-.001-3H9v-2h3V8z"
    />
  </svg>
);

type EmptyStateConfig = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  showCta: boolean;
};

const EMPTY_PEMERIKSAAN: EmptyStateConfig = {
  title: 'Belum ada data pemeriksaan',
  desc: 'Data pemeriksaan balita yang sudah dipublikasikan akan tampil di sini. Unggah data pemeriksaan pertama Anda untuk memulai.',
  icon: NotebookPlusIcon,
  showCta: false,
};

function getEmptyStateConfig(
  filter: FilterResepType,
  searchQuery: string
): EmptyStateConfig {
  if (searchQuery.trim() !== '') {
    return {
      title: 'Tidak Ditemukan',
      desc: `Tidak ada resep dengan nama "${searchQuery.trim()}". Coba kata kunci lain.`,
      icon: (
        <svg
          className={ICON_CLASS}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8s3.59 8 8 8c1.85 0 3.54-.63 4.9-1.69l5.1 5.1L21.41 20l-5.1-5.1A8 8 0 0 0 18 10M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6"
          />
          <path
            fill="currentColor"
            d="M12.29 6.29L10 8.59l-2.29-2.3l-1.42 1.42L8.59 10l-2.3 2.29l1.42 1.42l2.29-2.3l2.29 2.3l1.42-1.42l-2.3-2.29l2.3-2.29z"
          />
        </svg>
      ),
      showCta: false,
    };
  }

  if (filter === 'Draft') {
    return {
      title: 'Tidak ada draft tersimpan',
      desc: 'Semua resep sudah dipublikasikan.\nDraft baru akan muncul di sini\nsaat kamu menyimpan resep yang belum selesai.',
      icon: <FileText className={ICON_CLASS} strokeWidth={1.8} />,
      showCta: false,
    };
  }

  if (filter === 'Terpublikasi') {
    return {
      title: 'Belum ada resep terpublikasi',
      desc: 'Ada draft yang belum tayang.\nSelesaikan dan publikasikan agar terlihat',
      icon: <Upload className={ICON_CLASS} strokeWidth={1.8} />,
      showCta: false,
    };
  }

  return {
    title: 'Belum ada resep yang dibuat',
    desc: 'Saat ini belum ada resep yang diunggah.\nYuk, mulai bagikan resep sehat untuk ibu dan balita!',
    icon: <ChefHat className={ICON_CLASS} strokeWidth={1.8} />,
    showCta: true,
  };
}

function EmptyState({
  config,
  onCtaClick,
}: {
  config: EmptyStateConfig;
  onCtaClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center">
      <div className="w-[80px] h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-[17px]">
        {config.icon}
      </div>
      <h3 className="text-black font-semibold text-[20px] leading-[24px]">
        {config.title}
      </h3>
      <p className="mt-[17px] max-w-[370px] whitespace-pre-line text-black/50 font-semibold text-[14px] leading-[17px]">
        {config.desc}
      </p>
      {config.showCta && onCtaClick && (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-[17px] w-[178px] h-[42px] bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none text-white rounded-[8px] font-bold text-[18px] transition-all duration-150 cursor-pointer"
        >
          Buat Resep
        </button>
      )}
    </div>
  );
}

function UnggahDataContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const balitaIdParam = searchParams.get('balitaId');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isResepRoute = pathname?.includes('/unggah-data/resep');

  const [activeTab, setActiveTab] = useState<'Pemeriksaan' | 'Resep'>(
    isResepRoute ? 'Resep' : 'Pemeriksaan'
  );

  useEffect(() => {
    setActiveTab(isResepRoute ? 'Resep' : 'Pemeriksaan');
  }, [isResepRoute]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleTabClick = (tab: 'Pemeriksaan' | 'Resep') => {
    setActiveTab(tab);
    if (tab === 'Resep') {
      router.push('/unggah-data/resep');
    } else {
      router.push('/unggah-data');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResep, setSearchResep] = useState('');
  const [filterResep, setFilterResep] = useState<FilterResepType>('Semua');
  const [resepList, setResepList] = useState<Resep[]>([]);
  const [balitaList, setBalitaList] = useState<any[]>([]);
  const [toast, setToast] = useState<ToastState>(null);
  const [commentPanelResep, setCommentPanelResep] = useState<Resep | null>(null);

  const [deleteTargetResep, setDeleteTargetResep] = useState<Resep | null>(null);

  const [openResepModal, setOpenResepModal] = useState(false);
  const [resepForm, setResepForm] = useState({
    image: null as File | null,
    imagePreview: '',
    nama: '',
    usia: '6 Bulan' as any,
    bahan: '',
    langkah: '',
    protein: '',
    karbohidrat: '',
    lemak: '',
    kalori: '',
    tips: '',
  });
  const [resepErrors, setResepErrors] = useState<Record<string, boolean>>({});
  const [, setIsSavingResep] = useState(false);

  // id resep yang sedang diedit (null = membuat resep baru)
  const [editingResepId, setEditingResepId] = useState<number | null>(null);
  // URL foto yang sudah tersimpan di server (Vercel Blob) untuk resep yang sedang diedit
  const [fotoLamaUrl, setFotoLamaUrl] = useState('');

  const pemeriksaan = usePemeriksaanForm(setToast);

  const fetchResepList = async () => {
    try {
      // resep milik kader yang login (draft dan terpublikasi)
      const res = await api<any>('/kader/recipes');
      if (res.success && res.data) {
        const formatted = res.data.map((r: any) => ({
          id: r.id,
          nama: r.title || r.nama || '',
          usia: USIA_DARI_API[String(r.age_category)] || r.target_age || r.usia || '6 Bulan',
          kalori:
            r.calories !== undefined && r.calories !== null
              ? `${r.calories} kkal`
              : r.kalori || '0 kkal',
          status: r.status === 'published' || r.status === 'terpublikasi' ? 'Terpublikasi' : 'Draft',
          image: pakaiFoto(r.image_url || r.photo_url || r.image),
          bahan: r.ingredients || r.bahan || '',
          langkah: r.steps || r.instructions || r.langkah || '',
          protein: r.protein_g !== undefined ? `${r.protein_g}g` : (r.protein || '0g'),
          karbohidrat: r.carbs_g !== undefined ? `${r.carbs_g}g` : (r.carbohydrate || r.karbohidrat || '0g'),
          lemak: r.fat_g !== undefined ? `${r.fat_g}g` : (r.fat || r.lemak || '0g'),
          tips: r.tips || '',
          commentsCount: r.comments_count || 0,
        }));
        setResepList(formatted);
      }
    } catch (err) {
      console.error('Gagal memuat daftar resep:', err);
    }
  };

  const fetchBalitaList = async () => {
    try {
      const res = await api<any>('/babies/all');
      if (res.success && res.data) {
        const formatted = res.data.map((b: any) => {
          let calculatedAge = b.age_months;
          if (!calculatedAge && b.birth_date) {
            const birth = new Date(b.birth_date);
            const now = new Date();
            const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
            calculatedAge = Math.max(0, diffMonths);
          }

          return {
            id: Number(b.id),
            nama: b.full_name || b.name || b.nama || '',
            jenisKelamin: b.gender === 'L' || b.gender === 'Laki-laki' ? 'Laki - laki' : 'Perempuan',
            usia: `${calculatedAge || 0} Bulan`,
            kondisi: b.condition_note || b.status || 'Normal',
            terakhir: b.last_checkup || '',
          };
        });
        setBalitaList(formatted);
      }
    } catch (err) {
      console.error('Gagal memuat daftar balita:', err);
    }
  };

  useEffect(() => {
    fetchResepList();
    fetchBalitaList();
  }, []);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!balitaIdParam || balitaList.length === 0) return;
    const found = balitaList.find((b) => b.id === Number(balitaIdParam));
    if (found) pemeriksaan.openNew(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balitaIdParam, balitaList]);

  useEffect(() => {
    const resepIdParam = searchParams.get('resepId');
    if (!resepIdParam || resepList.length === 0) return;
    const found = resepList.find((r) => r.id === Number(resepIdParam));
    if (found) {
      handleEditResep(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, resepList]);

  const handleAddResep = () => {
    setEditingResepId(null);
    setFotoLamaUrl('');
    setResepForm({
      image: null,
      imagePreview: '',
      nama: '',
      usia: '6 Bulan',
      bahan: '',
      langkah: '',
      protein: '',
      karbohidrat: '',
      lemak: '',
      kalori: '',
      tips: '',
    });
    setResepErrors({});
    setOpenResepModal(true);
  };

  const handleEditResep = (resep: Resep) => {
    // foto lama hanya dipakai kalau berupa URL hasil unggahan (https). Placeholder atau path lama dianggap belum ada foto.
    const fotoSudahDiServer = typeof resep.image === 'string' && resep.image.startsWith('https://');

    setEditingResepId(Number(resep.id));
    setFotoLamaUrl(fotoSudahDiServer ? resep.image : '');
    setResepForm({
      image: null,
      imagePreview: fotoSudahDiServer ? resep.image : '',
      nama: resep.nama,
      usia: (resep.usia as any) || '6 Bulan',
      bahan: resep.bahan || '',
      langkah: resep.langkah || '',
      protein: resep.protein || '',
      karbohidrat: resep.karbohidrat || '',
      lemak: resep.lemak || '',
      kalori: resep.kalori || '',
      tips: resep.tips || '',
    });
    setResepErrors({});
    setOpenResepModal(true);
  };

  const handleSaveResepAction = async (targetStatus: StatusResepType) => {
    const isPublish = targetStatus === 'Terpublikasi';

    // Nama wajib untuk draft maupun publikasi (aturan backend)
    if (!resepForm.nama.trim()) {
      setResepErrors({ nama: true });
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal',
        message: isPublish
          ? 'Nama resep wajib diisi untuk mempublikasikan.'
          : 'Nama resep wajib diisi untuk menyimpan draft.',
      });
      return;
    }

    // Publikasi wajib punya foto, draft boleh tanpa foto
    if (isPublish && !resepForm.image && !fotoLamaUrl) {
      setResepErrors((prev) => ({ ...prev, image: true }));
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal',
        message: 'Foto menu wajib diunggah untuk mempublikasikan. Pilih foto di bagian atas form, atau simpan sebagai draft.',
      });
      return;
    }

    setIsSavingResep(true);
    try {
      // 1. Foto: unggah foto baru kalau ada, kalau tidak pakai foto lama (bisa kosong untuk draft)
      let photoUrl = fotoLamaUrl;

      if (resepForm.image) {
        const formData = new FormData();
        formData.append('image', resepForm.image);

        // api() otomatis memakai token (localStorage / sessionStorage) dan mengatur multipart
        const uploadRes = await api<any>('/uploads/recipe-photo', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes?.success || !uploadRes?.data?.url) {
          throw new Error(uploadRes?.message || 'Gagal mengunggah foto.');
        }
        photoUrl = uploadRes.data.url as string;
      }

      // 2. Data resep
      const cleanNum = (val: any) => {
        if (val === undefined || val === null || val === '') return 0;
        const parsed = parseFloat(String(val).replace(/[^\d.,]/g, '').replace(',', '.'));
        return isNaN(parsed) ? 0 : parsed;
      };

      const payload = {
        title: resepForm.nama.trim(),
        photoUrl: photoUrl || '', // draft tanpa foto dikirim kosong
        ageCategory: usiaKeApi(resepForm.usia),
        ingredients: resepForm.bahan,
        steps: resepForm.langkah,
        proteinG: cleanNum(resepForm.protein),
        carbsG: cleanNum(resepForm.karbohidrat),
        fatG: cleanNum(resepForm.lemak),
        calories: cleanNum(resepForm.kalori),
        tips: resepForm.tips,
        status: isPublish ? 'terpublikasi' : 'draft',
      };

      // 3. Simpan: edit memakai PUT, resep baru memakai POST
      if (editingResepId !== null) {
        await api(`/recipes/${editingResepId}`, { method: 'PUT', body: payload });
      } else {
        await api('/recipes', { method: 'POST', body: payload });
      }

      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil',
        message:
          editingResepId !== null
            ? 'Resep berhasil diperbarui.'
            : isPublish
              ? 'Resep berhasil dipublikasikan.'
              : 'Draft berhasil disimpan.',
      });
      setOpenResepModal(false);
      setEditingResepId(null);
      setFotoLamaUrl('');

      // bersihkan ?resepId= supaya modal edit tidak terbuka lagi setelah daftar dimuat ulang
      if (searchParams.get('resepId')) router.replace('/unggah-data/resep');

      fetchResepList();
    } catch (err: any) {
      setToast({ visible: true, type: 'error', title: 'Gagal', message: err.message || 'Gagal menyimpan resep.' });
    } finally {
      setIsSavingResep(false);
    }
  };

  const handleConfirmDeleteResep = async () => {
    if (!deleteTargetResep) return;
    try {
      await api(`/recipes/${deleteTargetResep.id}`, { method: 'DELETE' });
      setToast({ visible: true, type: 'success', title: 'Berhasil', message: 'Resep berhasil dihapus.' });
      if (commentPanelResep?.id === deleteTargetResep.id) setCommentPanelResep(null);
      setDeleteTargetResep(null);
      fetchResepList();
    } catch (err: any) {
      setToast({ visible: true, type: 'error', title: 'Gagal', message: err.message || 'Gagal menghapus resep.' });
    }
  };

  const filteredData = balitaList.filter((b) =>
    (b.nama || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredResep = resepList.filter((r) => {
    const matchFilter = filterResep === 'Semua' ? true : r.status === filterResep;
    const matchSearch = (r.nama || '').toLowerCase().includes(searchResep.toLowerCase());
    return matchFilter && matchSearch;
  });

  const countDraft = resepList.filter((r) => r.status === 'Draft').length;
  const countTerpublikasi = resepList.filter((r) => r.status === 'Terpublikasi').length;

  const belumAdaPemeriksaan = balitaList.length === 0;
  const emptyState = getEmptyStateConfig(filterResep, searchResep);

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar
        activePage="unggah-data"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar
          title="Unggah Resep & Pemeriksaan"
          titleColor="#D45060"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-4 sm:pb-5">
            <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
              <div className="flex-1 max-w-[420px] h-[44px] sm:h-[52px] bg-[#FEEB96] rounded-[10px] sm:rounded-[12px] p-[4px] sm:p-[6px] flex">
                {(['Pemeriksaan', 'Resep'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`flex-1 rounded-[8px] sm:rounded-[10px] font-semibold text-[13px] sm:text-[15px] leading-[16px] sm:leading-[18px] transition-colors cursor-pointer ${
                      activeTab === tab
                        ? 'bg-[#FFB803] text-black'
                        : 'text-[#AAA6A6]/80 hover:bg-[#FFE9A8]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'Resep' && (
                <button
                  type="button"
                  onClick={handleAddResep}
                  aria-label="Tambah Resep"
                  className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full bg-white hover:bg-[#F7F8F0] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
                >
                  <Plus className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#D45060]" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {activeTab === 'Pemeriksaan' && (
              belumAdaPemeriksaan ? (
                <EmptyState config={EMPTY_PEMERIKSAAN} />
              ) : (
                <div className="bg-white rounded-[7px] px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Cari nama balita"
                    className="mb-4 sm:mb-5"
                  />

                  <div className="space-y-2">
                    {filteredData.length === 0 ? (
                      <div className="py-12 px-6 flex flex-col items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-4">
                          <svg
                            className="w-[40px] h-[40px] text-[#D45060]/80"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              fill="currentColor"
                              d="M18 10c0-4.41-3.59-8-8-8s-8 3.59-8 8s3.59 8 8 8c1.85 0 3.54-.63 4.9-1.69l5.1 5.1L21.41 20l-5.1-5.1A8 8 0 0 0 18 10M4 10c0-3.31 2.69-6 6-6s6 2.69 6 6s-2.69 6-6 6s-6-2.69-6-6"
                            />
                            <path
                              fill="currentColor"
                              d="M12.29 6.29L10 8.59l-2.29-2.3l-1.42 1.42L8.59 10l-2.3 2.29l1.42 1.42l2.29-2.3l2.29 2.3l1.42-1.42l-2.3-2.29l2.3-2.29z"
                            />
                          </svg>
                        </div>
                        <p className="text-[15px] font-semibold text-black mb-1">Tidak ada balita ditemukan</p>
                        <p className="text-[13px] text-[#8F8F8F] text-center max-w-[280px]">
                          Coba ubah kata kunci pencarian atau tambahkan data balita baru
                        </p>
                      </div>
                    ) : (
                      filteredData.map((balita) => (
                        <button
                          key={balita.id}
                          type="button"
                          onClick={() => router.push(`/unggah-data/detail?balitaId=${balita.id}`)}
                          className="w-full h-[64px] bg-white border border-black/25 rounded-[8px] flex items-center gap-3 px-3 sm:px-4 hover:bg-[#F7F8F0] active:bg-[#F0F0E8] transition-colors cursor-pointer text-left"
                        >
                          <div className="w-[38px] h-[38px] rounded-full bg-[#FCEBD5] flex items-center justify-center shrink-0">
                            <span className="text-[#D45060] font-bold text-[15px] leading-[18px]">
                              {(balita.nama || '?').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-black font-semibold text-[14px] sm:text-[15px] leading-[17px] sm:leading-[18px] truncate">
                              {balita.nama}
                            </p>
                            <p className="mt-[4px] text-[#8F8F8F] font-bold text-[11px] sm:text-[12px] leading-[13px] sm:leading-[14px] truncate">
                              {balita.jenisKelamin}<span className="mx-[6px]">•</span>{balita.usia}
                              {balita.terakhir && (
                                <>
                                  <span className="mx-[6px]">•</span>Terakhir {balita.terakhir}
                                </>
                              )}
                            </p>
                          </div>
                          <span className={`hidden sm:flex shrink-0 min-w-[80px] h-[26px] px-2 items-center justify-center rounded-[5px] font-bold text-[11px] leading-[14px] ${KONDISI_STYLE[balita.kondisi as KondisiType] || 'bg-gray-100 text-gray-800'}`}>
                            {balita.kondisi}
                          </span>
                          <ChevronRight className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-[#8F8F8F] shrink-0" strokeWidth={2.5} />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )
            )}

            {activeTab === 'Resep' && (
              <>
                <div className="bg-white rounded-[12px] px-4 sm:px-5 pt-4 pb-4 mb-4 sm:mb-5">
                  <FilterTabs
                    options={['Semua', 'Draft', 'Terpublikasi'] as const}
                    value={filterResep}
                    onChange={setFilterResep}
                    labels={{
                      Semua: 'Semua',
                      Draft: `Draft (${countDraft})`,
                      Terpublikasi: `Terpublikasi (${countTerpublikasi})`,
                    }}
                    className="mb-4"
                  />
                  <SearchInput
                    value={searchResep}
                    onChange={setSearchResep}
                    placeholder="Cari nama resep........"
                  />
                </div>

                {filteredResep.length === 0 ? (
                  <EmptyState config={emptyState} onCtaClick={handleAddResep} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,160px)] gap-3 sm:gap-4">
                    {filteredResep.map((resep) => (
                      <ResepCard
                        key={resep.id}
                        resep={resep}
                        onEdit={(r) => handleEditResep(r)}
                        onDelete={(r) => setDeleteTargetResep(r)}
                        onCommentClick={(r) => setCommentPanelResep(r)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* key = id resep: setiap pindah resep, panel dibuat ulang sehingga komentar resep lain tidak terbawa */}
          {commentPanelResep && (
            <KomentarPanel
              key={commentPanelResep.id}
              resep={commentPanelResep}
              onClose={() => setCommentPanelResep(null)}
            />
          )}
        </div>
      </main>

      {openResepModal && (
        <TambahResepModal
          data={resepForm}
          errors={resepErrors}
          onChange={(field: any, val: any) => {
            setResepForm((prev) => ({ ...prev, [field]: val }));
            // hilangkan tanda merah begitu foto dipilih / nama diisi
            if (field === 'image' || field === 'nama') {
              setResepErrors((prev) => ({ ...prev, [field]: false }));
            }
          }}
          onClose={() => setOpenResepModal(false)}
          onPublish={() => handleSaveResepAction('Terpublikasi')}
          onSaveDraft={() => handleSaveResepAction('Draft')}
        />
      )}

      {pemeriksaan.open && (
        <PemeriksaanModal
          data={pemeriksaan.form}
          errors={pemeriksaan.errors}
          onChange={pemeriksaan.handleChange}
          onToggleBahan={pemeriksaan.handleToggleBahan}
          onClose={() => pemeriksaan.setOpen(false)}
          onSave={pemeriksaan.handleSave}
          onDelete={pemeriksaan.handleDelete}
        />
      )}

      {deleteTargetResep && (
        <ConfirmDeleteModal
          onClose={() => setDeleteTargetResep(null)}
          onConfirm={handleConfirmDeleteResep}
        />
      )}

      {toast?.visible && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

// ================= EXPORT: dibungkus penjaga login =================
export default function UnggahDataPage() {
  return (
    <AuthGuard role="kader">
      <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
        <UnggahDataContent />
      </Suspense>
    </AuthGuard>
  );
}