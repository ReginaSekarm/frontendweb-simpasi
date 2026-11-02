'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { CaretDown } from '@phosphor-icons/react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import type { Balita, BalitaForm, PemeriksaanForm, FilterType, ToastState, ConfirmDeleteType } from './types';
import { BALITA_DATA, FILTER_OPTIONS, KONDISI_STYLE, EMPTY_FORM, EMPTY_PEMERIKSAAN } from './data';

import Toast from './components/Toast';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import BalitaFormModal from './components/BalitaFormModal';
import PemeriksaanModal from './components/PemeriksaanModal';

const ITEMS_PER_PAGE = 5;

// ================= ICON MASK (ganti warna via bg) =================
type MaskIconProps = {
  src: string;
  alt: string;
  className?: string;
  color?: string;
};
function MaskIcon({ src, alt, className = '', color = '#D45060' }: MaskIconProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`${className} ${color.startsWith('#') ? '' : ''}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  );
}

export default function DataBalitaPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Semua');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<BalitaForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // STATE BARU: search query dari Topbar
  const [searchQuery, setSearchQuery] = useState('');

  const [balitaList, setBalitaList] = useState<Balita[]>(BALITA_DATA);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  const [periksaOpen, setPeriksaOpen] = useState(false);
  const [periksaBalita, setPeriksaBalita] = useState<Balita | null>(null);
  const [periksaForm, setPeriksaForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [periksaErrors, setPeriksaErrors] = useState<Record<string, boolean>>({});

  const [toast, setToast] = useState<ToastState>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteType>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // ===== Click outside filter =====
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== Auto-dismiss toast =====
  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Reset halaman ketika filter atau search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery]);

  // ================= FILTER LOGIC (search + kondisi) =================
  const isDataEmpty = balitaList.length === 0;

  // Filter by search dulu
  const searchedData = searchQuery.trim() === ''
    ? balitaList
    : balitaList.filter((b) =>
        b.nama.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

  // Lalu filter by kondisi
  const filteredData = selectedFilter === 'Semua'
    ? searchedData
    : searchedData.filter((b) => b.kondisi === selectedFilter);

  const isFilterEmpty = !isDataEmpty && filteredData.length === 0;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const goPrev = () => {
    if (currentPage > 1) {
      setSlideDirection('left');
      setCurrentPage((p) => p - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setSlideDirection('right');
      setCurrentPage((p) => p + 1);
    }
  };

  // ===== Handlers Tambah/Edit =====
  const handleOpenAdd = () => {
    setFormData({ ...EMPTY_FORM });
    setFormErrors({});
    setFormMode('add');
    setEditTargetId(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: Balita) => {
    setFormData({
      nama: item.nama,
      jenisKelamin: item.jenisKelamin,
      usia: item.usia,
      tempatLahir: item.tempatLahir,
      tanggalLahir: item.tanggalLahir,
      namaOrtu: item.namaOrtu,
      email: item.email,
      bb: item.bb,
      tb: item.tb,
      lk: item.lk,
      lila: item.lila,
      kondisi: item.kondisi,
    });
    setFormErrors({});
    setFormMode('edit');
    setEditTargetId(item.id);
    setFormOpen(true);
  };

  const handleChangeField = (field: keyof BalitaForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: false }));
  };

  const validateBalitaForm = (): boolean => {
    const required: (keyof BalitaForm)[] = ['nama', 'usia', 'tempatLahir', 'tanggalLahir', 'namaOrtu', 'email', 'bb', 'tb', 'lk', 'lila'];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!formData[f] || String(formData[f]).trim() === '') errs[f] = true;
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateBalitaForm()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan' });
      return;
    }

    if (formMode === 'add') {
      const newBalita: Balita = {
        id: Date.now(),
        nama: formData.nama,
        jenisKelamin: formData.jenisKelamin === '' ? 'Laki - laki' : formData.jenisKelamin,
        usia: formData.usia,
        tempatLahir: formData.tempatLahir,
        tanggalLahir: formData.tanggalLahir,
        namaOrtu: formData.namaOrtu,
        email: formData.email,
        kondisi: formData.kondisi === '' ? 'Belum Diperiksa' : formData.kondisi,
        bb: formData.bb,
        tb: formData.tb,
        lk: formData.lk,
        lila: formData.lila,
      };

      setBalitaList((prev) => [newBalita, ...prev]);

      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil Disimpan',
        message: 'Data balita telah berhasil disimpan dan dipublikasikan',
      });
    } else {
      if (editTargetId !== null) {
        setBalitaList((prev) =>
          prev.map((b) =>
            b.id === editTargetId
              ? {
                  ...b,
                  nama: formData.nama,
                  jenisKelamin: formData.jenisKelamin === '' ? 'Laki - laki' : formData.jenisKelamin,
                  usia: formData.usia,
                  tempatLahir: formData.tempatLahir,
                  tanggalLahir: formData.tanggalLahir,
                  namaOrtu: formData.namaOrtu,
                  email: formData.email,
                  kondisi: formData.kondisi === '' ? 'Belum Diperiksa' : formData.kondisi,
                  bb: formData.bb,
                  tb: formData.tb,
                  lk: formData.lk,
                  lila: formData.lila,
                }
              : b
          )
        );
      }

      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil Disimpan',
        message: 'Data balita telah berhasil diperbarui dan disimpan',
      });
    }

    setFormOpen(false);
    setEditTargetId(null);
  };

  const handleDelete = () => setConfirmDelete('balita');

  const handleOpenPeriksa = (item: Balita) => {
    setPeriksaBalita(item);
    setPeriksaForm({
      bb: item.bb,
      tb: item.tb,
      lk: item.lk,
      lila: item.lila,
      catatan: '',
      bahanMakanan: [],
      kondisi: item.kondisi === 'Belum Diperiksa' ? 'Normal' : item.kondisi,
      tanggalPemeriksaan: '',
    });
    setPeriksaErrors({});
    router.push(`/unggah-data?balitaId=${item.id}`);
  };

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
    const required: (keyof PemeriksaanForm)[] = ['bb', 'tb', 'lk', 'lila', 'tanggalPemeriksaan'];
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
    console.log('Simpan pemeriksaan untuk:', periksaBalita?.nama, periksaForm);
    setPeriksaOpen(false);
    setToast({ visible: true, type: 'success', title: 'Berhasil Disimpan', message: 'Data pemeriksaan telah berhasil diperbarui dan disimpan' });
  };

  const handleDeletePeriksa = () => setConfirmDelete('pemeriksaan');

  const executeDelete = () => {
    if (confirmDelete === 'balita') {
      if (editTargetId !== null) {
        setBalitaList((prev) => prev.filter((b) => b.id !== editTargetId));
      }

      setFormOpen(false);
      setConfirmDelete(null);
      setEditTargetId(null);
      setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: 'Data balita telah berhasil dihapus dari sistem.' });
    } else if (confirmDelete === 'pemeriksaan') {
      console.log('Hapus pemeriksaan untuk:', periksaBalita?.nama);
      setPeriksaOpen(false);
      setConfirmDelete(null);
      setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: 'Data pemeriksaan telah berhasil dihapus dari sistem.' });
    }
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar
        activePage="data-balita"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        {/* Topbar dengan search ter-wire */}
        <Topbar
          title="Data Balita"
          titleColor="#D45060"
          showSearch
          searchPlaceholder="Cari nama balita..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-5 lg:pt-8 pb-4 sm:pb-5 lg:pb-6">
          
          {/* Tombol Tambah Balita — hanya muncul kalau BUKAN data kosong */}
          {!isDataEmpty && (
          <div className="flex justify-end mb-3 sm:mb-4">
            <button 
              type="button" 
              onClick={handleOpenAdd} 
              className="flex items-center gap-2 h-[42px] sm:h-[50px] px-3 sm:px-4 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none text-white font-semibold text-[13px] sm:text-[15px] rounded-[10px] transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" strokeWidth={2.5} />
              <span>Balita</span>
            </button>
          </div>
          )}

          <div className={`bg-white rounded-[7px] overflow-hidden ${
          isDataEmpty || isFilterEmpty
            ? 'flex flex-col min-h-[460px] sm:min-h-[500px] lg:min-h-[561px]'
            : ''
            }`}>
            {/* Area Filter */}
            <div className="pt-4 pb-4 pl-4 sm:pl-6 relative" ref={filterRef}>
              <button 
                type="button" 
                onClick={() => setFilterOpen(!filterOpen)} 
                className="flex items-center gap-2 h-[34px] px-3 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] text-white font-semibold text-[13px] sm:text-[14px] rounded-[8px] transition-all cursor-pointer"
              >
                <span>{selectedFilter}</span>
                <CaretDown className={`w-[16px] h-[16px] transition-transform ${filterOpen ? 'rotate-180' : ''}`} weight="fill" />
              </button>
              {filterOpen && (
                <div className="absolute top-[46px] left-4 sm:left-6 z-30 w-[130px] bg-white rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden border border-[#D9D9D9]">
                  {FILTER_OPTIONS.map((opt) => (
                    <button 
                      key={opt} 
                      type="button" 
                      onClick={() => { setSelectedFilter(opt); setFilterOpen(false); }} 
                      className={`w-full text-left px-3 py-2 text-[13px] font-semibold transition-colors cursor-pointer ${selectedFilter === opt ? 'text-[#D45060] bg-[#FCEBD5]' : 'text-[#797777] hover:bg-[#F7F8F0]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* KONDISI 1: BELUM ADA DATA BALITA — icon keranjang bayi dengan warna #D45060 */}
            {isDataEmpty ? (
                <div className="flex-1 pt-6 pb-[66px] px-4 flex flex-col items-center justify-center">
                {/* Circle peach dengan icon keranjang bayi */}
                <div className="w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                  {/* Pakai MaskIcon — warna otomatis #D45060 */}
                  <MaskIcon
                    src="/images/baby-carriage.svg"
                    alt="Belum ada data balita"
                    color="#D45060"
                    className="w-[35px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[35px] lg:h-[35px]"
                  />
                </div>

                {/* Judul */}
                <h3 className="text-black font-bold text-[18px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-[28px] lg:leading-[32px] text-center mb-2 sm:mb-3">
                  Belum Ada Data Balita
                </h3>

                {/* Deskripsi */}
                <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[280px] sm:max-w-[330px] lg:max-w-[380px] mb-6 sm:mb-7 lg:mb-8">
                  Data balita di posyandu Anda akan muncul di sini. Mulai tambahkan data balita pertama untuk memantau tumbuh kembangnya.
                </p>

                {/* Tombol CTA */}
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="flex items-center gap-2 h-[42px] sm:h-[46px] px-5 sm:px-6 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none text-white font-bold text-[13px] sm:text-[15px] rounded-[10px] transition-all duration-150 cursor-pointer"
                >
                  <Plus className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                  <span>Tambah Balita</span>
                </button>
              </div>
            ) : isFilterEmpty ? (
              /* KONDISI 2: TIDAK DITEMUKAN — icon search-x warna #D45060 */
                <div className="flex-1 pt-6 pb-[66px] px-4 flex flex-col items-center justify-center">
                  {/* Circle peach dengan icon search-x */}
                <div className="w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                  {/* Pakai MaskIcon — warna otomatis #D45060 */}
                  <MaskIcon
                    src="/images/search-x.svg"
                    alt="Tidak ditemukan"
                    color="#D45060"
                    className="w-[35px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[35px] lg:h-[35px]"
                  />
                </div>

                {/* Judul */}
                <h3 className="text-black font-bold text-[18px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-[28px] lg:leading-[32px] text-center mb-2 sm:mb-3">
                  Tidak Ditemukan
                </h3>

                {/* Deskripsi — dinamis sesuai pencarian/filter */}
                <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[280px] sm:max-w-[330px] lg:max-w-[380px]">
                  {searchQuery.trim() !== ''
                    ? `Tidak ada balita dengan nama yang mengandung "${searchQuery.trim()}". Coba kata kunci lain.`
                    : 'Tidak ada balita yang cocok dengan filter yang dipilih. Coba filter lain.'}
                </p>
              </div>
            ) : (
              /* KONDISI 3: ADA DATA — tampilkan tabel */
              <>
                {/* Header Tabel */}
                <div className="bg-[#1A7772] min-h-[38px] grid grid-cols-[1.3fr_1fr_0.8fr_1fr_1.2fr] items-center px-3 sm:px-4 text-white font-bold text-[11px] sm:text-[13px] lg:text-[14px]">
                  <span className="pl-2 sm:pl-[20px]">Nama</span>
                  <span className="text-center">Jenis Kelamin</span>
                  <span className="text-center">Usia</span>
                  <span className="text-center">Kondisi</span>
                  <span className="text-center">Aksi</span>
                </div>

                <div className="relative overflow-hidden">
                  <div
                    key={currentPage}
                    className={`${
                      slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                    }`}
                  >
                    {paginatedData.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className={`grid grid-cols-[1.3fr_1fr_0.8fr_1fr_1.2fr] items-center px-3 sm:px-4 min-h-[54px] text-black font-medium text-[11px] sm:text-[12px] lg:text-[14px] hover:bg-[#F7F8F0] transition-colors ${idx !== paginatedData.length - 1 ? 'border-b border-[#AAA6A6]' : ''}`}
                      >
                        <span className="pl-2 sm:pl-[14px] truncate">{item.nama}</span>
                        <span className="text-center truncate">{item.jenisKelamin}</span>
                        <span className="text-center truncate">{item.usia}</span>
                        <span className="flex justify-center">
                          <span className={`min-w-[60px] sm:min-w-[80px] min-h-[22px] sm:min-h-[24px] px-1.5 sm:px-2 py-0.5 flex items-center justify-center rounded-[6px] font-bold text-[9px] sm:text-[10px] lg:text-[11px] leading-[12px] lg:leading-[14px] text-center ${KONDISI_STYLE[item.kondisi]}`}>
                            {item.kondisi}
                          </span>
                        </span>
                        <span className="flex items-center justify-center gap-2 sm:gap-3">
                          <button 
                            type="button" 
                            aria-label={`Edit ${item.nama}`} 
                            onClick={() => handleOpenEdit(item)} 
                            className="text-black/70 hover:text-[#D45060] active:scale-90 transition-all cursor-pointer"
                          >
                            <Pencil className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" strokeWidth={2.2} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleOpenPeriksa(item)} 
                            className="min-w-[60px] sm:min-w-[80px] h-[24px] sm:h-[26px] bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] rounded-[6px] text-black/70 font-semibold text-[10px] sm:text-[12px] transition-all cursor-pointer"
                          >
                            Periksa
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3">
                  <span className="text-[10px] sm:text-[11px] text-[#8F8F8F] font-semibold">
                    {filteredData.length > 0
                      ? `Hal. ${currentPage} dari ${totalPages} • ${filteredData.length} data`
                      : ''}
                  </span>

                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={currentPage === 1 || filteredData.length === 0}
                      aria-label="Halaman sebelumnya"
                      className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[6px] flex items-center justify-center transition-all ${
                        currentPage === 1 || filteredData.length === 0
                          ? 'bg-[#F0F0F0] border border-[#F0F0F0] cursor-not-allowed'
                          : 'bg-white border-2 border-black hover:bg-[#2E9C52]/10 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft
                        className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] ${
                          currentPage === 1 || filteredData.length === 0 ? 'text-[#B0B0B0]' : 'text-black'
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={currentPage === totalPages || filteredData.length === 0}
                      aria-label="Halaman berikutnya"
                      className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[6px] flex items-center justify-center transition-all ${
                        currentPage === totalPages || filteredData.length === 0
                          ? 'bg-[#F0F0F0] border border-[#F0F0F0] cursor-not-allowed'
                          : 'bg-white border-2 border-black hover:bg-[#2E9C52]/10 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <ChevronRight
                        className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] ${
                          currentPage === totalPages || filteredData.length === 0 ? 'text-[#B0B0B0]' : 'text-black'
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {formOpen && (
        <BalitaFormModal
          key={`${formMode}-${formOpen}`}
          mode={formMode}
          data={formData}
          errors={formErrors}
          onChange={handleChangeField}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {periksaOpen && periksaBalita && (
        <PemeriksaanModal
          balita={periksaBalita}
          data={periksaForm}
          errors={periksaErrors}
          onChange={handleChangePeriksa}
          onToggleBahan={handleToggleBahan}
          onClose={() => setPeriksaOpen(false)}
          onSave={handleSavePeriksa}
          onDelete={handleDeletePeriksa}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          type={confirmDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={executeDelete}
        />
      )}

      {toast?.visible && (
        <Toast type={toast.type} title={toast.title} message={toast.message} />
      )}
    </div>
  );
}