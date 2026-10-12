'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ChevronRight, FileText, Upload, ChefHat } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import type { FilterResepType, KomentarResep, Resep, ToastState } from './types';
import {
  BALITA_DATA,
  RESEP_DATA,
  KONDISI_STYLE,
  KOMENTAR_PER_RESEP,
} from './data';

import Toast from './components/Toast';
import TambahResepModal from './components/TambahResepModal';
import PemeriksaanModal from './components/PemeriksaanModal';
import ResepCard from './components/ResepCard';
import KomentarPanel from './components/KomentarPanel';
import SearchInput from './components/SearchInput';
import FilterTabs from './components/FilterTabs';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

import { useResepForm } from './hooks/useResepForm';
import { usePemeriksaanForm } from './hooks/usePemeriksaanForm';

// ================= EMPTY STATE =================
const ICON_CLASS = 'w-[40px] h-[40px] text-[#D45060]/80';

// Ikon buku catatan + tanda plus (Pemeriksaan kosong)
const NotebookPlusIcon = (
  <svg
    className={ICON_CLASS}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="3" width="13" height="18" rx="2" />
    <path d="M3 7h3M3 11h3M3 15h3" />
    <path d="M12.5 9v6M9.5 12h6" />
  </svg>
);

type EmptyStateConfig = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  showCta: boolean;
};

// Empty state tab Pemeriksaan
const EMPTY_PEMERIKSAAN: EmptyStateConfig = {
  title: 'Belum ada data pemeriksaan',
  desc: 'Data pemeriksaan balita yang sudah dipublikasikan akan tampil di sini. Unggah data pemeriksaan pertama Anda untuk memulai.',
  icon: NotebookPlusIcon,
  showCta: false,
};

// Empty state tab Resep (urutan: search -> filter Draft -> filter Terpublikasi -> Semua)
function getEmptyStateConfig(
  filter: FilterResepType,
  searchQuery: string
): EmptyStateConfig {
  // Prioritas 1: user sedang search & tidak ada hasil
  if (searchQuery.trim() !== '') {
    return {
      title: 'Tidak Ditemukan',
      desc: `Tidak ada resep dengan nama "${searchQuery.trim()}". Coba kata kunci lain.`,
      icon: (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/search-x.svg"
          alt="Tidak ditemukan"
          className="w-[40px] h-[40px] object-contain"
        />
      ),
      showCta: false,
    };
  }

  // Prioritas 2: filter Draft aktif & draft kosong
  if (filter === 'Draft') {
    return {
      title: 'Tidak ada draft tersimpan',
      desc: 'Semua resep sudah dipublikasikan.\nDraft baru akan muncul di sini\nsaat kamu menyimpan resep yang belum selesai.',
      icon: <FileText className={ICON_CLASS} strokeWidth={1.8} />,
      showCta: false,
    };
  }

  // Prioritas 3: filter Terpublikasi aktif & belum ada yang terbit
  if (filter === 'Terpublikasi') {
    return {
      title: 'Belum ada resep terpublikasi',
      desc: 'Ada draft yang belum tayang.\nSelesaikan dan publikasikan agar terlihat',
      icon: <Upload className={ICON_CLASS} strokeWidth={1.8} />,
      showCta: false,
    };
  }

  // Prioritas 4: tab "Semua" & belum ada resep sama sekali
  return {
    title: 'Belum ada resep yang dibuat',
    desc: 'Saat ini belum ada resep yang diunggah.\nYuk, mulai bagikan resep sehat untuk ibu dan balita!',
    icon: <ChefHat className={ICON_CLASS} strokeWidth={1.8} />,
    showCta: true,
  };
}

// Tampilan empty state (tanpa kartu putih, langsung di atas background tosca seperti Figma)
function EmptyState({
  config,
  onCtaClick,
}: {
  config: EmptyStateConfig;
  onCtaClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-6 text-center">
      {/* Circle peach 80x80 */}
      <div className="w-[80px] h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-[17px]">
        {config.icon}
      </div>

      {/* Judul */}
      <h3 className="text-black font-semibold text-[20px] leading-[24px]">
        {config.title}
      </h3>

      {/* Deskripsi */}
      <p className="mt-[17px] max-w-[370px] whitespace-pre-line text-black/50 font-semibold text-[14px] leading-[17px]">
        {config.desc}
      </p>

      {/* Tombol CTA */}
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
  const [resepList, setResepList] = useState<Resep[]>(RESEP_DATA);
  const [balitaList] = useState(BALITA_DATA);
  const [toast, setToast] = useState<ToastState>(null);
  const [commentPanelResep, setCommentPanelResep] = useState<Resep | null>(null);

  const [deleteTargetResep, setDeleteTargetResep] = useState<Resep | null>(null);

  const resepForm = useResepForm(resepList, setResepList, setToast);
  const pemeriksaan = usePemeriksaanForm(setToast);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!balitaIdParam) return;
    const found = balitaList.find((b) => b.id === Number(balitaIdParam));
    if (found) pemeriksaan.openNew(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balitaIdParam]);

  useEffect(() => {
    const resepIdParam = searchParams.get('resepId');
    if (!resepIdParam) return;
    const found = resepList.find((r) => r.id === Number(resepIdParam));
    if (found) resepForm.handleEdit(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredData = balitaList.filter((b) =>
    b.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredResep = resepList.filter((r) => {
    const matchFilter = filterResep === 'Semua' ? true : r.status === filterResep;
    const matchSearch = r.nama.toLowerCase().includes(searchResep.toLowerCase());
    return matchFilter && matchSearch;
  });

  const countDraft = resepList.filter((r) => r.status === 'Draft').length;
  const countTerpublikasi = resepList.filter((r) => r.status === 'Terpublikasi').length;

  const currentKomentar: KomentarResep[] = commentPanelResep
    ? KOMENTAR_PER_RESEP[commentPanelResep.id] || []
    : [];

  const handleConfirmDeleteResep = () => {
    if (!deleteTargetResep) return;
    resepForm.handleDelete(deleteTargetResep);
    setDeleteTargetResep(null);
  };

  // Belum ada data pemeriksaan sama sekali
  const belumAdaPemeriksaan = balitaList.length === 0;

  // Konfigurasi empty state Resep berdasarkan search & filter
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
            
            {/* Tabs & Tombol Tambah */}
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
                  onClick={resepForm.handleAdd}
                  aria-label="Tambah Resep"
                  className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-full bg-white hover:bg-[#F7F8F0] active:scale-95 focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none flex items-center justify-center transition-all duration-150 cursor-pointer shrink-0"
                >
                  <Plus className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#D45060]" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Tab Pemeriksaan */}
            {activeTab === 'Pemeriksaan' && (
              belumAdaPemeriksaan ? (
                // EMPTY STATE: belum ada data pemeriksaan
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
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D45060" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 15h8M9 9h.01M15 9h.01" />
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
                              {balita.nama.charAt(0).toUpperCase()}
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
                          <span className={`hidden sm:flex shrink-0 min-w-[80px] h-[26px] px-2 items-center justify-center rounded-[5px] font-bold text-[11px] leading-[14px] ${KONDISI_STYLE[balita.kondisi]}`}>
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

            {/* Tab Resep */}
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
                  // EMPTY STATE dinamis berdasarkan search & filter
                  <EmptyState config={emptyState} onCtaClick={resepForm.handleAdd} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,160px)] gap-3 sm:gap-4">
                    {filteredResep.map((resep) => (
                      <ResepCard
                        key={resep.id}
                        resep={resep}
                        onEdit={resepForm.handleEdit}
                        onDelete={setDeleteTargetResep}
                        onCommentClick={setCommentPanelResep}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {commentPanelResep && (
            <KomentarPanel
              resep={commentPanelResep}
              komentar={currentKomentar}
              onClose={() => setCommentPanelResep(null)}
            />
          )}
        </div>
      </main>

      {resepForm.open && (
        <TambahResepModal
          data={resepForm.form}
          errors={resepForm.errors}
          onChange={resepForm.handleChange}
          onClose={() => resepForm.setOpen(false)}
          onPublish={resepForm.handlePublish}
          onSaveDraft={resepForm.handleSaveDraft}
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
    <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
      <UnggahDataContent />
    </Suspense>
  );
}