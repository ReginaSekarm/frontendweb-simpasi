'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ChevronRight, FileText, Upload, ChefHat } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AuthGuard from '../../components/AuthGuard';

import type { FilterResepType, Resep, StatusResepType, ToastState } from './types';
import type { KondisiType } from './types';

import Toast from './components/Toast';
import TambahResepModal from './components/TambahResepModal';
import PemeriksaanModal from './components/PemeriksaanModal';
import ResepCard from './components/ResepCard';
import KomentarPanel from './components/KomentarPanel';
import SearchInput from './components/SearchInput';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

import { usePemeriksaanForm } from './hooks/usePemeriksaanForm';
import { api } from '../../lib/api';

// ================= STYLING KONDISI (SESUAI FIGMA) =================
const KONDISI_STYLE: Record<string, string> = {
  Normal: 'bg-[#E0F2FE] text-[#0284C7]',
  Berisiko: 'bg-[#FEF3C7] text-[#D97706]',
  Stunting: 'bg-[#FEE2E2] text-[#DC2626]',
  'Belum Diperiksa': 'bg-gray-100 text-gray-800',
};

// ================= FOTO PLACEHOLDER =================
const FOTO_KOSONG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect width="100%" height="100%" fill="#FCEBD5"/><text x="50%" y="50%" fill="#D45060" font-size="14" font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">Belum ada foto</text></svg>'
  );

const pakaiFoto = (url: unknown): string =>
  typeof url === 'string' && url.startsWith('https://') ? url : FOTO_KOSONG;

// ================= HELPER HASH FOTO (DETEKSI DUPLIKASI GAMBAR) =================
const RECIPE_IMAGE_HASH_STORAGE_KEY = 'simpasi_recipe_image_hashes';

async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getStoredImageHashes(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(RECIPE_IMAGE_HASH_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveImageHashForRecipe(hash: string, recipeId: number) {
  if (typeof window === 'undefined') return;
  const map = getStoredImageHashes();
  map[hash] = recipeId;
  localStorage.setItem(RECIPE_IMAGE_HASH_STORAGE_KEY, JSON.stringify(map));
}

function removeImageHashByRecipeId(recipeId: number) {
  if (typeof window === 'undefined') return;
  const map = getStoredImageHashes();
  for (const [hash, id] of Object.entries(map)) {
    if (Number(id) === Number(recipeId)) {
      delete map[hash];
    }
  }
  localStorage.setItem(RECIPE_IMAGE_HASH_STORAGE_KEY, JSON.stringify(map));
}

// ================= USIA =================
const USIA_DARI_API: Record<string, string> = {
  '6': '6 Bulan',
  '7-8': '7 - 8 Bulan',
  '9-11': '9 - 11 Bulan',
  '12+': '12 Bulan +',
};

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

  const [editingResepId, setEditingResepId] = useState<number | null>(null);
  const [fotoLamaUrl, setFotoLamaUrl] = useState('');

  const pemeriksaan = usePemeriksaanForm(setToast);

  const fetchResepList = async () => {
    try {
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

          // Format kapitalisasi kondisi agar pas dengan Figma ("Berisiko", "Normal", "Stunting")
          let rawKondisi = b.condition_note || b.status || 'Normal';
          if (typeof rawKondisi === 'string') {
            rawKondisi = rawKondisi.charAt(0).toUpperCase() + rawKondisi.slice(1).toLowerCase();
          }

          return {
            id: Number(b.id),
            nama: b.full_name || b.name || b.nama || '',
            jenisKelamin: b.gender === 'L' || b.gender === 'Laki-laki' ? 'Laki - laki' : 'Perempuan',
            usia: `${calculatedAge || 0} Bulan`,
            kondisi: rawKondisi,
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
    const nextErrors: Record<string, boolean> = {};
    const cleanTitle = resepForm.nama.trim();

    if (!cleanTitle) {
      nextErrors.nama = true;
      setResepErrors(nextErrors);
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

    // Cek duplikasi nama resep (baik untuk publikasi maupun draft, kecualikan ID yang sedang diedit)
    const isDuplicateTitle = resepList.some(
      (r) =>
        Number(r.id) !== Number(editingResepId) &&
        String(r.nama ?? '').trim().toLowerCase() === cleanTitle.toLowerCase()
    );
    if (isDuplicateTitle) {
      nextErrors.nama = true;
      setResepErrors(nextErrors);
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal',
        message: 'Nama resep sudah pernah digunakan. Gunakan nama resep yang lain.',
      });
      return;
    }

    if (isPublish && !resepForm.image && !fotoLamaUrl) {
      nextErrors.image = true;
      setResepErrors(nextErrors);
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal',
        message: 'Foto menu wajib diunggah untuk mempublikasikan. Pilih foto di bagian atas form, atau simpan sebagai draft.',
      });
      return;
    }

    // Cek duplikasi foto menu (berdasarkan hash isi file gambar)
    let uploadedImageHash: string | null = null;
    if (resepForm.image) {
      uploadedImageHash = await computeFileHash(resepForm.image);
      const existingHashes = getStoredImageHashes();
      const matchedRecipeId = existingHashes[uploadedImageHash];
      const stillExistsInList = resepList.some((r) => Number(r.id) === Number(matchedRecipeId));

      if (
        matchedRecipeId !== undefined &&
        stillExistsInList &&
        Number(matchedRecipeId) !== Number(editingResepId)
      ) {
        nextErrors.image = true;
        setResepErrors(nextErrors);
        setToast({
          visible: true,
          type: 'error',
          title: 'Gagal',
          message: 'Foto menu sudah pernah digunakan pada resep lain. Gunakan foto yang berbeda.',
        });
        return;
      }
    } else if (fotoLamaUrl) {
      const isDuplicatePhotoUrl = resepList.some(
        (r) =>
          Number(r.id) !== Number(editingResepId) &&
          typeof r.image === 'string' &&
          r.image.startsWith('https://') &&
          r.image === fotoLamaUrl
      );
      if (isDuplicatePhotoUrl) {
        nextErrors.image = true;
        setResepErrors(nextErrors);
        setToast({
          visible: true,
          type: 'error',
          title: 'Gagal',
          message: 'Foto menu sudah pernah digunakan pada resep lain. Gunakan foto yang berbeda.',
        });
        return;
      }
    }

    // Validasi detail nutrisi: jika diisi wajib angka valid (baik draft maupun publikasi)
    const stripUnit = (val: string) =>
      val.trim().replace(/\s*(kkal|gr|g)$/i, '').trim();

    const isValidNutritionNumber = (raw: string) => {
      const cleaned = stripUnit(raw).replace(',', '.');
      if (cleaned === '') return true;
      return /^\d+(\.\d+)?$/.test(cleaned);
    };

    const nutritionFields = [
      { key: 'protein', label: 'Protein', value: resepForm.protein },
      { key: 'karbohidrat', label: 'Karbohidrat', value: resepForm.karbohidrat },
      { key: 'lemak', label: 'Lemak', value: resepForm.lemak },
      { key: 'kalori', label: 'Estimasi Kalori', value: resepForm.kalori },
    ] as const;

    for (const field of nutritionFields) {
      const rawVal = String(field.value ?? '').trim();

      if (isPublish && rawVal === '') {
        nextErrors[field.key] = true;
        setResepErrors(nextErrors);
        setToast({
          visible: true,
          type: 'error',
          title: 'Gagal',
          message: `${field.label} wajib diisi untuk mempublikasikan resep.`,
        });
        return;
      }

      if (rawVal !== '' && !isValidNutritionNumber(rawVal)) {
        nextErrors[field.key] = true;
        setResepErrors(nextErrors);
        setToast({
          visible: true,
          type: 'error',
          title: 'Gagal',
          message: 'Detail nutrisi harus berupa angka (contoh: 12 atau 12.5).',
        });
        return;
      }
    }

    setIsSavingResep(true);
    try {
      let photoUrl = fotoLamaUrl;

      if (resepForm.image) {
        const formData = new FormData();
        formData.append('image', resepForm.image);

        const uploadRes = await api<any>('/uploads/recipe-photo', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes?.success || !uploadRes?.data?.url) {
          throw new Error(uploadRes?.message || 'Gagal mengunggah foto.');
        }
        photoUrl = uploadRes.data.url as string;
      }

      const toNumberOrEmpty = (val: string) => {
        const cleaned = stripUnit(String(val ?? '')).replace(',', '.');
        return cleaned === '' ? '' : Number(cleaned);
      };

      const payload = {
        title: cleanTitle,
        photoUrl: photoUrl || '',
        ageCategory: usiaKeApi(resepForm.usia),
        ingredients: resepForm.bahan,
        steps: resepForm.langkah,
        proteinG: toNumberOrEmpty(resepForm.protein),
        carbsG: toNumberOrEmpty(resepForm.karbohidrat),
        fatG: toNumberOrEmpty(resepForm.lemak),
        calories: toNumberOrEmpty(resepForm.kalori),
        tips: resepForm.tips,
        status: isPublish ? 'terpublikasi' : 'draft',
      };

      let savedId = editingResepId;
      if (editingResepId !== null) {
        await api(`/recipes/${editingResepId}`, { method: 'PUT', body: payload });
      } else {
        const createRes = await api<any>('/recipes', { method: 'POST', body: payload });
        savedId = createRes?.data?.id ?? null;
      }

      if (uploadedImageHash && savedId !== null) {
        if (editingResepId !== null) {
          removeImageHashByRecipeId(editingResepId);
        }
        saveImageHashForRecipe(uploadedImageHash, Number(savedId));
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
      const deletedId = Number(deleteTargetResep.id);
      await api(`/recipes/${deletedId}`, { method: 'DELETE' });
      removeImageHashByRecipeId(deletedId);
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
            {/* LAYOUT FIGMA: satu kolom terpusat, lebar sama untuk tab, panel, dan kartu */}
            <div className="mx-auto w-full max-w-[934px]">
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
                    <div className="flex items-center gap-2 mb-4">
                      {(['Semua', 'Draft', 'Terpublikasi'] as const).map((tabKey) => {
                        const isActive = filterResep === tabKey;
                        const labelText =
                          tabKey === 'Semua'
                            ? 'Semua'
                            : tabKey === 'Draft'
                              ? `Draft (${countDraft})`
                              : `Terpublikasi (${countTerpublikasi})`;

                        return (
                          <button
                            key={tabKey}
                            type="button"
                            onClick={() => setFilterResep(tabKey)}
                            className={`h-[36px] px-4 rounded-[8px] font-bold text-[13px] transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#D45060] text-white shadow-sm'
                                : 'bg-white border border-[#AAA6A6]/60 text-[#797777] hover:bg-[#F7F8F0]'
                            }`}
                          >
                            {labelText}
                          </button>
                        );
                      })}
                    </div>

                    <SearchInput
                      value={searchResep}
                      onChange={setSearchResep}
                      placeholder="Cari nama resep........"
                    />
                  </div>

                  {filteredResep.length === 0 ? (
                    <EmptyState config={emptyState} onCtaClick={handleAddResep} />
                  ) : (
                    // LAYOUT FIGMA: kartu dibagi rata dari tepi kiri ke tepi kanan kolom
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,160px)] md:justify-between gap-3 sm:gap-4 md:gap-y-[26px]">
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
          </div>

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
            if (['image', 'nama', 'protein', 'karbohidrat', 'lemak', 'kalori'].includes(field)) {
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

export default function UnggahDataPage() {
  return (
    <AuthGuard role="kader">
      <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
        <UnggahDataContent />
      </Suspense>
    </AuthGuard>
  );
}