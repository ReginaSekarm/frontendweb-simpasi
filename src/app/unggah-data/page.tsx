'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, ChevronRight } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import type { FilterResepType, KomentarResep, Resep, ToastState } from './_types';
import {
  BALITA_DATA,
  RESEP_DATA,
  KONDISI_STYLE,
  KOMENTAR_PER_RESEP,
} from './_data';

import Toast from './_components/Toast';
import TambahResepModal from './_components/TambahResepModal';
import PemeriksaanModal from './_components/PemeriksaanModal';
import ResepCard from './_components/ResepCard';
import KomentarPanel from './_components/KomentarPanel';
import SearchInput from './_components/SearchInput';
import FilterTabs from './_components/FilterTabs';

import { useResepForm } from './_hooks/useResepForm';
import { usePemeriksaanForm } from './_hooks/usePemeriksaanForm';

function UnggahDataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const balitaIdParam = searchParams.get('balitaId');

  const [activeTab, setActiveTab] = useState<'Pemeriksaan' | 'Resep'>('Pemeriksaan');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResep, setSearchResep] = useState('');
  const [filterResep, setFilterResep] = useState<FilterResepType>('Semua');
  const [resepList, setResepList] = useState<Resep[]>(RESEP_DATA);
  const [balitaList] = useState(BALITA_DATA);
  const [toast, setToast] = useState<ToastState>(null);
  const [commentPanelResep, setCommentPanelResep] = useState<Resep | null>(null);

  const resepForm = useResepForm(resepList, setResepList, setToast);
  const pemeriksaan = usePemeriksaanForm(setToast);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Auto-open pemeriksaan dari ?balitaId=X
  useEffect(() => {
    if (!balitaIdParam) return;
    const found = balitaList.find((b) => b.id === Number(balitaIdParam));
    if (found) pemeriksaan.openNew(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balitaIdParam]);

  // Auto-open edit resep dari ?tab=Resep&resepId=X
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const resepIdParam = searchParams.get('resepId');
    if (tabParam === 'Resep') setActiveTab('Resep');
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

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="unggah-data" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Unggah Resep & Pemeriksaan" titleColor="#D45060" />

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto px-[37px] pt-[30px] pb-[27px]">
            {/* Tabs + tombol tambah */}
            <div className="flex items-center justify-between mb-[28px]">
              <div className="w-[596px] h-[73px] bg-[#FEEB96] rounded-[17px] p-[8px] flex">
                {(['Pemeriksaan', 'Resep'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-[17px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${
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
                  className="w-[88px] h-[88px] rounded-full bg-white hover:bg-[#F7F8F0] flex items-center justify-center transition-colors active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-[34px] h-[34px] text-[#D45060]" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Tab Pemeriksaan */}
            {activeTab === 'Pemeriksaan' && (
              <div className="bg-white rounded-[7px] px-[42px] pt-[55px] pb-[40px]">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Cari nama balita"
                  className="mb-[54px]"
                />

                <div className="space-y-[9px]">
                  {filteredData.length === 0 ? (
                    <div className="h-[140px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                      Tidak ada balita yang cocok dengan pencarian.
                    </div>
                  ) : (
                    filteredData.map((balita) => (
                      <button
                        key={balita.id}
                        type="button"
                        onClick={() => router.push(`/unggah-data/detail?balitaId=${balita.id}`)}
                        className="w-full h-[88px] bg-white border border-black/25 rounded-[9px] flex items-center gap-[19px] px-[18px] hover:bg-[#F7F8F0] transition-colors cursor-pointer text-left"
                      >
                        <div className="w-[51px] h-[51px] rounded-full bg-[#FCEBD5] flex items-center justify-center shrink-0">
                          <span className="text-[#D45060] font-bold text-[20.25px] leading-[25px]">
                            {balita.nama.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-black font-semibold text-[20.25px] leading-[25px] truncate">
                            {balita.nama}
                          </p>
                          <p className="mt-[6px] text-[#8F8F8F] font-bold text-[16.875px] leading-[20px] truncate">
                            {balita.jenisKelamin}<span className="mx-[8px]">•</span>{balita.usia}
                            {balita.terakhir && (
                              <>
                                <span className="mx-[8px]">•</span>Terakhir {balita.terakhir}
                              </>
                            )}
                          </p>
                        </div>
                        <span className={`shrink-0 min-w-[101px] h-[33px] px-3 flex items-center justify-center rounded-[6px] font-bold text-[14.625px] leading-[18px] ${KONDISI_STYLE[balita.kondisi]}`}>
                          {balita.kondisi}
                        </span>
                        <ChevronRight className="w-[30px] h-[30px] text-[#8F8F8F] shrink-0" strokeWidth={2.5} />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab Resep */}
            {activeTab === 'Resep' && (
              <>
                <div className="bg-white rounded-[17px] px-[36px] pt-[31px] pb-[31px] mb-[30px]">
                  <FilterTabs
                    options={['Semua', 'Draft', 'Terpublikasi'] as const}
                    value={filterResep}
                    onChange={setFilterResep}
                    labels={{
                      Semua: 'Semua',
                      Draft: `Draft (${countDraft})`,
                      Terpublikasi: `Terpublikasi (${countTerpublikasi})`,
                    }}
                    className="mb-[26px]"
                  />
                  <SearchInput
                    value={searchResep}
                    onChange={setSearchResep}
                    placeholder="Cari nama resep........"
                  />
                </div>

                {filteredResep.length === 0 ? (
                  <div className="bg-white rounded-[7px] h-[200px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                    Tidak ada resep yang cocok.
                  </div>
                ) : (
                  <div
                    className={`grid gap-[22px] transition-all ${
                      commentPanelResep
                        ? 'grid-cols-3'
                        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    }`}
                  >
                    {filteredResep.map((resep) => (
                      <ResepCard
                        key={resep.id}
                        resep={resep}
                        onEdit={resepForm.handleEdit}
                        onDelete={resepForm.handleDelete}
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