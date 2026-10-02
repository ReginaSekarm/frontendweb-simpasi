'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, ChevronRight } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import type {
  Resep,
  FilterResepType,
  PemeriksaanForm,
  TambahResepForm,
  ToastState,
} from './_types';

import {
  BALITA_DATA,
  RESEP_DATA,
  EMPTY_PEMERIKSAAN,
  EMPTY_TAMBAH_RESEP,
  KONDISI_STYLE,
  mapUsiaKeForm,
} from './_data';

import Toast from './_components/Toast';
import TambahResepModal from './_components/TambahResepModal';
import PemeriksaanModal from './_components/PemeriksaanModal';
import ResepCard from './_components/ResepCard';

import { loadJSON, saveJSON, addAktivitas } from '../../lib/simpasi-store';

const KEY_RESEP = 'simpasi_resep';

function UnggahDataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const balitaIdParam = searchParams.get('balitaId');

  const [activeTab, setActiveTab] = useState<'Pemeriksaan' | 'Resep'>('Pemeriksaan');
  const [searchQuery, setSearchQuery] = useState('');

  const [periksaOpen, setPeriksaOpen] = useState(false);
  const [periksaForm, setPeriksaForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [periksaErrors, setPeriksaErrors] = useState<Record<string, boolean>>({});

  const [filterResep, setFilterResep] = useState<FilterResepType>('Semua');
  const [searchResep, setSearchResep] = useState('');

  // ✅ Resep jadi STATE — biar bisa nambah/edit/hapus + persist
  const [resepList, setResepList] = useState<Resep[]>(RESEP_DATA);
  const [editResepTargetId, setEditResepTargetId] = useState<number | null>(null);
  const [isResepLoaded, setIsResepLoaded] = useState(false);

  const [tambahResepOpen, setTambahResepOpen] = useState(false);
  const [tambahResepForm, setTambahResepForm] = useState<TambahResepForm>(EMPTY_TAMBAH_RESEP);
  const [tambahResepErrors, setTambahResepErrors] = useState<Record<string, boolean>>({});

  const [toast, setToast] = useState<ToastState>(null);

  // ===== Load balita dari localStorage =====
  const [balitaList, setBalitaList] = useState(BALITA_DATA);
  useEffect(() => {
    const saved = loadJSON<typeof BALITA_DATA | null>('simpasi_balita', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setBalitaList(saved);
    }
  }, []);

  // ===== LOAD resep dari localStorage — SEKALI AJA =====
  useEffect(() => {
    const saved = loadJSON<Resep[] | null>(KEY_RESEP, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setResepList(saved);
    }
    setIsResepLoaded(true);
  }, []);

  // ===== SAVE resep — hanya kalau sudah loaded =====
  useEffect(() => {
    if (!isResepLoaded) return;
    saveJSON(KEY_RESEP, resepList);
  }, [resepList, isResepLoaded]);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!balitaIdParam) return;
    const found = balitaList.find((b) => b.id === Number(balitaIdParam));
    if (!found) return;
    setPeriksaForm({
      ...EMPTY_PEMERIKSAAN,
      nama: found.nama,
      jenisKelamin: found.jenisKelamin,
      usia: found.usia,
      tempatLahir: found.tempatLahir,
      tanggalLahir: found.tanggalLahir,
      namaOrtu: found.namaOrtu,
      email: found.email,
    });
    setPeriksaErrors({});
    setPeriksaOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balitaIdParam]);

  const filteredData = balitaList.filter((b) => b.nama.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredResep = resepList.filter((r) => {
    const matchFilter = filterResep === 'Semua' ? true : r.status === filterResep;
    const matchSearch = r.nama.toLowerCase().includes(searchResep.toLowerCase());
    return matchFilter && matchSearch;
  });

  const countDraft = resepList.filter((r) => r.status === 'Draft').length;
  const countTerpublikasi = resepList.filter((r) => r.status === 'Terpublikasi').length;

  const handleChangePeriksa = (field: keyof PemeriksaanForm, value: string | string[]) => {
    setPeriksaForm((prev) => ({ ...prev, [field]: value }));
    if (periksaErrors[field]) setPeriksaErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleToggleBahan = (bahan: string) => {
    setPeriksaForm((prev) => {
      const isActive = prev.bahanMakanan.includes(bahan);
      return {
        ...prev,
        bahanMakanan: isActive ? prev.bahanMakanan.filter((b) => b !== bahan) : [...prev.bahanMakanan, bahan],
      };
    });
  };

  const validatePeriksaForm = (): boolean => {
    const required: (keyof PemeriksaanForm)[] = [
      'nama', 'jenisKelamin', 'usia', 'tempatLahir', 'tanggalLahir', 'namaOrtu', 'email',
      'bb', 'tb', 'lk', 'lila', 'tanggalPemeriksaan',
    ];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!periksaForm[f] || String(periksaForm[f]).trim() === '') errs[f] = true;
    });
    setPeriksaErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePeriksa = () => {
    if (!validatePeriksaForm()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan' });
      return;
    }
    console.log('Simpan pemeriksaan:', periksaForm);
    setPeriksaOpen(false);
    setToast({ visible: true, type: 'success', title: 'Berhasil Disimpan', message: 'Data pemeriksaan telah berhasil diperbarui dan disimpan' });
  };

  const handleDeletePeriksa = () => {
    if (confirm('Yakin ingin menghapus data pemeriksaan ini?')) {
      setPeriksaOpen(false);
      setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: 'Data pemeriksaan telah berhasil dihapus dari sistem.' });
    }
  };

  // ===== Resep: buka modal add =====
  const handleAddResep = () => {
    setTambahResepForm({ ...EMPTY_TAMBAH_RESEP });
    setTambahResepErrors({});
    setEditResepTargetId(null);
    setTambahResepOpen(true);
  };

  // ===== Resep: buka modal edit — PRE-FILL SEMUA FIELD =====
  const handleEditResep = (resep: Resep) => {
    setTambahResepForm({
      image: null,
      imagePreview: resep.image,
      nama: resep.nama,
      usia: mapUsiaKeForm(resep.usia),
      bahan: resep.bahan || '',
      langkah: resep.langkah || '',
      protein: resep.protein || '',
      karbohidrat: resep.karbohidrat || '',
      lemak: resep.lemak || '',
      kalori: resep.kalori,
      tips: resep.tips || '',
    });
    setTambahResepErrors({});
    setEditResepTargetId(resep.id);
    setTambahResepOpen(true);
  };

  // ===== Resep: hapus =====
  const handleDeleteResep = (resep: Resep) => {
    if (confirm(`Yakin ingin menghapus resep "${resep.nama}"?`)) {
      setResepList((prev) => prev.filter((r) => r.id !== resep.id));

      addAktivitas({
        type: 'resep',
        description: `Menghapus resep "${resep.nama}"`,
        status: 'Draft',
      });

      setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: `Resep "${resep.nama}" telah berhasil dihapus dari sistem.` });
    }
  };

  const handleChangeTambahResep = (field: keyof TambahResepForm, value: string | File | null) => {
    setTambahResepForm((prev) => ({ ...prev, [field]: value }));
    if (tambahResepErrors[field]) setTambahResepErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateTambahResep = (): boolean => {
    const required: (keyof TambahResepForm)[] = ['nama', 'usia', 'bahan', 'langkah', 'kalori'];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!tambahResepForm[f] || String(tambahResepForm[f]).trim() === '') errs[f] = true;
    });
    setTambahResepErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ✅ Helper: bikin object resep lengkap dari form
  const buildResepFromForm = (status: 'Draft' | 'Terpublikasi', existingImage?: string): Partial<Resep> => ({
    nama: tambahResepForm.nama,
    usia: tambahResepForm.usia,
    kalori: tambahResepForm.kalori,
    status,
    image: tambahResepForm.imagePreview || existingImage || '/images/placeholder.png',
    bahan: tambahResepForm.bahan,
    langkah: tambahResepForm.langkah,
    protein: tambahResepForm.protein,
    karbohidrat: tambahResepForm.karbohidrat,
    lemak: tambahResepForm.lemak,
    tips: tambahResepForm.tips,
  });

  // ===== Resep: publikasikan =====
  const handlePublishResep = () => {
    if (!validateTambahResep()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum mempublikasikan' });
      return;
    }

    if (editResepTargetId !== null) {
      setResepList((prev) =>
        prev.map((r) =>
          r.id === editResepTargetId
            ? { ...r, ...buildResepFromForm('Terpublikasi', r.image) }
            : r
        )
      );

      addAktivitas({
        type: 'resep',
        description: `Mempublikasikan resep "${tambahResepForm.nama}"`,
        status: 'Terpublikasi',
      });

      setToast({ visible: true, type: 'success', title: 'Berhasil Dipublikasikan', message: `Resep "${tambahResepForm.nama}" telah berhasil dipublikasikan` });
    } else {
      const newResep: Resep = {
        id: Date.now(),
        ...buildResepFromForm('Terpublikasi'),
      } as Resep;
      setResepList((prev) => [newResep, ...prev]);

      addAktivitas({
        type: 'resep',
        description: `Mempublikasikan resep "${tambahResepForm.nama}"`,
        status: 'Terpublikasi',
      });

      setToast({ visible: true, type: 'success', title: 'Berhasil Dipublikasikan', message: `Resep "${tambahResepForm.nama}" telah berhasil dipublikasikan` });
    }

    setTambahResepOpen(false);
    setEditResepTargetId(null);
  };

  // ===== Resep: simpan draft =====
  const handleSaveDraftResep = () => {
    if (!validateTambahResep()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan draft' });
      return;
    }

    if (editResepTargetId !== null) {
      setResepList((prev) =>
        prev.map((r) =>
          r.id === editResepTargetId
            ? { ...r, ...buildResepFromForm('Draft', r.image) }
            : r
        )
      );

      addAktivitas({
        type: 'resep',
        description: `Menyimpan draft resep "${tambahResepForm.nama}"`,
        status: 'Draft',
      });

      setToast({ visible: true, type: 'success', title: 'Berhasil Disimpan', message: `Resep "${tambahResepForm.nama}" telah disimpan sebagai draft` });
    } else {
      const newResep: Resep = {
        id: Date.now(),
        ...buildResepFromForm('Draft'),
      } as Resep;
      setResepList((prev) => [newResep, ...prev]);

      addAktivitas({
        type: 'resep',
        description: `Menambahkan resep "${tambahResepForm.nama}"`,
        status: 'Draft',
      });

      setToast({ visible: true, type: 'success', title: 'Berhasil Disimpan', message: `Resep "${tambahResepForm.nama}" telah disimpan sebagai draft` });
    }

    setTambahResepOpen(false);
    setEditResepTargetId(null);
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="unggah-data" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Unggah Resep & Pemeriksaan" titleColor="#D45060" />

        <div className="flex-1 overflow-y-auto px-[37px] pt-[30px] pb-[27px]">
          <div className="flex items-center justify-between mb-[28px]">
            <div className="w-[596px] h-[73px] bg-[#FEEB96] rounded-[17px] p-[8px] flex">
              <button type="button" onClick={() => setActiveTab('Pemeriksaan')} className={`flex-1 rounded-[17px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${activeTab === 'Pemeriksaan' ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6]/80 hover:bg-[#FFE9A8]'}`}>
                Pemeriksaan
              </button>
              <button type="button" onClick={() => setActiveTab('Resep')} className={`flex-1 rounded-[17px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${activeTab === 'Resep' ? 'bg-[#FFB803] text-black' : 'text-[#AAA6A6]/80 hover:bg-[#FFE9A8]'}`}>
                Resep
              </button>
            </div>

            {activeTab === 'Resep' && (
              <button type="button" onClick={handleAddResep} aria-label="Tambah Resep" className="w-[88px] h-[88px] rounded-full bg-white hover:bg-[#F7F8F0] flex items-center justify-center transition-colors active:scale-95 cursor-pointer shrink-0">
                <Plus className="w-[34px] h-[34px] text-[#D45060]" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {activeTab === 'Pemeriksaan' && (
            <div className="bg-white rounded-[7px] px-[42px] pt-[55px] pb-[40px]">
              <div className="relative w-full max-w-[555px] mb-[54px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama balita"
                  className="w-full h-[56px] pl-[29px] pr-14 rounded-[9px] border border-black/25 bg-white text-[20px] font-semibold text-black placeholder-[#8F8F8F] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
                />
                <Search className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] text-[#8F8F8F]" strokeWidth={2} />
              </div>

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
                        <span className="text-[#D45060] font-bold text-[20.25px] leading-[25px]">{balita.nama.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-black font-semibold text-[20.25px] leading-[25px] truncate">{balita.nama}</p>
                        <p className="mt-[6px] text-[#8F8F8F] font-bold text-[16.875px] leading-[20px] truncate">
                          {balita.jenisKelamin}<span className="mx-[8px]">•</span>{balita.usia}
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

          {activeTab === 'Resep' && (
            <>
              <div className="bg-white rounded-[17px] px-[36px] pt-[31px] pb-[31px] mb-[30px]">
                <div className="flex flex-wrap items-center gap-[12px] mb-[26px]">
                  {(['Semua', 'Draft', 'Terpublikasi'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilterResep(f)}
                      className={`h-[42px] px-[20px] rounded-[9px] font-semibold text-[22.5px] leading-[27px] transition-colors cursor-pointer ${filterResep === f ? 'bg-[#D45060] text-white' : 'bg-[#D9D9D9]/50 text-[#AAA6A6]/50 hover:bg-[#D9D9D9]/70'}`}
                    >
                      {f === 'Semua' ? 'Semua' : f === 'Draft' ? `Draft (${countDraft})` : `Terpublikasi (${countTerpublikasi})`}
                    </button>
                  ))}
                </div>

                <div className="relative w-full max-w-[555px]">
                  <input
                    type="text"
                    value={searchResep}
                    onChange={(e) => setSearchResep(e.target.value)}
                    placeholder="Cari nama resep........"
                    className="w-full h-[56px] pl-[29px] pr-14 rounded-[9px] border border-black/25 bg-white text-[20px] font-semibold text-black placeholder-[#8F8F8F] focus:outline-none focus:border-[#D45060] focus:ring-1 focus:ring-[#D45060] transition-colors"
                  />
                  <Search className="absolute right-[18px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] text-[#8F8F8F]" strokeWidth={2} />
                </div>
              </div>

              {filteredResep.length === 0 ? (
                <div className="bg-white rounded-[7px] h-[200px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                  Tidak ada resep yang cocok.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[22px]">
                  {filteredResep.map((resep) => (
                    <ResepCard key={resep.id} resep={resep} onEdit={handleEditResep} onDelete={handleDeleteResep} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {tambahResepOpen && (
        <TambahResepModal
          data={tambahResepForm}
          errors={tambahResepErrors}
          onChange={handleChangeTambahResep}
          onClose={() => setTambahResepOpen(false)}
          onPublish={handlePublishResep}
          onSaveDraft={handleSaveDraftResep}
        />
      )}

      {periksaOpen && (
        <PemeriksaanModal
          data={periksaForm}
          errors={periksaErrors}
          onChange={handleChangePeriksa}
          onToggleBahan={handleToggleBahan}
          onClose={() => setPeriksaOpen(false)}
          onSave={handleSavePeriksa}
          onDelete={handleDeletePeriksa}
        />
      )}

      {toast?.visible && (
        <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />
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