'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { CaretDown } from '@phosphor-icons/react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import AuthGuard from '../../components/AuthGuard';
import { babyService } from '../../services';

import type { Balita, BalitaForm, PemeriksaanForm, FilterType, ToastState, ConfirmDeleteType } from './types';
import { FILTER_OPTIONS, KONDISI_STYLE, EMPTY_FORM, EMPTY_PEMERIKSAAN } from './data';

import Toast from './components/Toast';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import BalitaFormModal from './components/BalitaFormModal';
import PemeriksaanModal from './components/PemeriksaanModal';

const ITEMS_PER_PAGE = 10;

// PERUBAHAN 1: Proporsi kolom dibuat lebih seimbang agar tidak ada gap yang terlalu jauh
const TABLE_GRID =
  'grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.5fr)]';

// ================= PEMETAAN DATA BACKEND <-> TAMPILAN =================
// Nilai jenis kelamin yang dikirim ke backend (ubah di sini kalau validator minta format lain)
const GENDER_KE_BACKEND = { laki: 'L', perempuan: 'P' };

const pick = (o: any, ...keys: string[]): any => {
  for (const k of keys) {
    const v = o?.[k];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
};

const toArray = (d: any): any[] => {
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.data?.items)) return d.data.items;
  if (Array.isArray(d?.data?.babies)) return d.data.babies;
  if (Array.isArray(d?.babies)) return d.babies;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

// ================= TANGGAL LAHIR & USIA OTOMATIS =================
// Nama bulan (Indonesia dan Inggris) -> nomor bulan, dibaca dari 3 huruf pertama
const NOMOR_BULAN: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7,
  agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12,
};

// Terima: 2025-12-31, 31/12/2025, 31-12-2025, 31.12.2025, "31 Desember 2025", "31 Des 2025"
const parseTanggal = (v: unknown): Date | null => {
  const s = String(v ?? '').trim();
  if (!s) return null;

  let y = 0;
  let m = 0;
  let d = 0;

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const lokal = s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  const teks = s.match(/^(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})$/);

  if (iso) {
    y = Number(iso[1]);
    m = Number(iso[2]);
    d = Number(iso[3]);
  } else if (lokal) {
    d = Number(lokal[1]);
    m = Number(lokal[2]);
    y = Number(lokal[3]);
  } else if (teks) {
    d = Number(teks[1]);
    m = NOMOR_BULAN[teks[2].toLowerCase().slice(0, 3)] ?? 0;
    y = Number(teks[3]);
  } else {
    return null;
  }

  if (!m) return null;
  const t = new Date(y, m - 1, d);
  if (t.getFullYear() !== y || t.getMonth() !== m - 1 || t.getDate() !== d) return null;
  return t;
};

// Ubah ke YYYY-MM-DD (format yang diminta backend)
const keIso = (v: unknown): string => {
  const t = parseTanggal(v);
  if (!t) return String(v ?? '');
  const mm = String(t.getMonth() + 1).padStart(2, '0');
  const dd = String(t.getDate()).padStart(2, '0');
  return `${t.getFullYear()}-${mm}-${dd}`;
};

// Hitung usia dalam bulan dari tanggal lahir; kosong kalau tanggal tidak valid atau di masa depan
const hitungUsia = (lahir: unknown): string => {
  const t = parseTanggal(lahir);
  if (!t) return '';
  const now = new Date();
  if (t.getTime() > now.getTime()) return '';
  let bln = (now.getFullYear() - t.getFullYear()) * 12 + (now.getMonth() - t.getMonth());
  if (now.getDate() < t.getDate()) bln -= 1;
  return `${Math.max(0, bln)} Bulan`;
};

const mapGender = (v: any): Balita['jenisKelamin'] => {
  const s = String(v ?? '').toLowerCase();
  if (s.startsWith('p') || s.startsWith('f')) return 'Perempuan' as Balita['jenisKelamin'];
  return 'Laki - laki' as Balita['jenisKelamin'];
};

const mapKondisi = (v: any): Balita['kondisi'] => {
  const s = String(v ?? '').toLowerCase();
  if (s.includes('stunting')) return 'Stunting' as Balita['kondisi'];
  if (s.includes('risiko') || s.includes('risk')) return 'Berisiko' as Balita['kondisi'];
  if (s.includes('normal')) return 'Normal' as Balita['kondisi'];
  return 'Belum Diperiksa' as Balita['kondisi'];
};

// Backend -> baris tabel / form edit (toleran terhadap camelCase maupun snake_case)
const mapBalita = (o: any, i: number): Balita => {
  const lahirRaw = String(pick(o, 'birthDate', 'birth_date', 'tanggalLahir', 'dob'));
  const lahir = parseTanggal(lahirRaw) ? keIso(lahirRaw) : lahirRaw;

  // Usia selalu dihitung dari tanggal lahir supaya tidak basi; kalau tanggal tidak ada, pakai nilai dari backend
  const umur = pick(o, 'ageMonths', 'age_months', 'usiaBulan', 'usia', 'age');
  const usiaBackend =
    typeof umur === 'number' || /^\d+$/.test(String(umur)) ? `${umur} Bulan` : String(umur);
  const usia = hitungUsia(lahirRaw) || usiaBackend;

  return {
    id: Number(pick(o, 'id', 'babyId', 'baby_id')) || i + 1,
    nama: String(pick(o, 'fullName', 'full_name', 'name', 'nama')),
    jenisKelamin: mapGender(pick(o, 'gender', 'jenisKelamin', 'jenis_kelamin')),
    usia,
    tempatLahir: String(pick(o, 'birthPlace', 'birth_place', 'tempatLahir')),
    tanggalLahir: lahir,
    namaOrtu: String(pick(o, 'parentName', 'parent_name', 'namaOrtu')),
    email: String(pick(o, 'parentEmail', 'parent_email', 'email')),
    kondisi: mapKondisi(
      pick(
        o,
        'nutritionStatus', 'nutrition_status', 'statusGizi', 'status_gizi',
        'latestStatus', 'latest_status', 'status', 'kondisi', 'condition',
        'conditionNote', 'condition_note'
      )
    ),
    bb: String(pick(o, 'weightKg', 'weight_kg', 'weight', 'bb')),
    tb: String(pick(o, 'heightCm', 'height_cm', 'height', 'tb')),
    lk: String(pick(o, 'headCircumferenceCm', 'head_circumference_cm', 'headCircumference', 'lk')),
    lila: String(pick(o, 'lilaCm', 'lila_cm', 'lila')),
  } as Balita;
};

const toNum = (v: string): number => Number(String(v).replace(',', '.'));

// Form -> body request (nama field sesuai babyController.ts). Usia tidak dikirim karena dihitung dari tanggal lahir.
const toBody = (f: BalitaForm): Record<string, unknown> => {
  const body: Record<string, unknown> = {
    fullName: f.nama,
    gender: f.jenisKelamin === 'Perempuan' ? GENDER_KE_BACKEND.perempuan : GENDER_KE_BACKEND.laki,
    birthPlace: f.tempatLahir,
    birthDate: keIso(f.tanggalLahir),
    parentName: f.namaOrtu,
    parentEmail: f.email,
    weightKg: toNum(f.bb),
    heightCm: toNum(f.tb),
    headCircumferenceCm: toNum(f.lk),
    lilaCm: toNum(f.lila),
  };
  if (f.kondisi && f.kondisi !== 'Belum Diperiksa') body.conditionNote = f.kondisi;
  return body;
};

// ================= ICON EDIT =================
function IconEdit({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 20h16M4 20v-4l8-8M4 20h4l8-8m-4-4l2.869-2.869l.001-.001c.395-.395.593-.593.821-.667a1 1 0 0 1 .618 0c.228.074.425.272.82.666l1.74 1.74c.396.396.594.594.668.822a1 1 0 0 1 0 .618c-.074.228-.272.426-.668.822h0L16 12.001m-4-4l4 4"
      />
    </svg>
  );
}

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
      className={className}
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

function DataBalitaContent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Semua');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<BalitaForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const [searchQuery, setSearchQuery] = useState('');

  // Data dari backend
  const [balitaList, setBalitaList] = useState<Balita[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
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

  // ===== Ambil data balita dari backend =====
  const loadBalita = useCallback(async () => {
    try {
      const res = await babyService.list();
      setBalitaList(toArray(res).map(mapBalita));
      setLoadError('');
    } catch (err: any) {
      setLoadError(err?.message || 'Gagal memuat data balita');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBalita();
  }, [loadBalita]);

  // ===== Usia otomatis: setiap tanggal lahir di form berubah, usia ikut dihitung ulang =====
  useEffect(() => {
    if (!formOpen) return;
    const usiaBaru = hitungUsia(formData.tanggalLahir);
    setFormData((prev) => (prev.usia === usiaBaru ? prev : { ...prev, usia: usiaBaru }));
  }, [formOpen, formData.tanggalLahir]);

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
  const isDataEmpty = !loading && balitaList.length === 0;

  const searchedData = searchQuery.trim() === ''
    ? balitaList
    : balitaList.filter((b) =>
        b.nama.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );

  const filteredData = selectedFilter === 'Semua'
    ? searchedData
    : searchedData.filter((b) => b.kondisi === selectedFilter);

  const isFilterEmpty = !loading && !isDataEmpty && filteredData.length === 0;

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
      usia: hitungUsia(item.tanggalLahir) || item.usia,
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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // usia dihitung otomatis setiap kali tanggal lahir diisi atau diubah
      if (field === 'tanggalLahir') next.usia = hitungUsia(value);
      return next;
    });
    setFormErrors((prev) => {
      const next = { ...prev, [field]: false };
      if (field === 'tanggalLahir') next.usia = false;
      return next;
    });
  };

  const validateBalitaForm = (): boolean => {
    // 'usia' tidak diwajibkan: nilainya turunan dari tanggal lahir
    const required: (keyof BalitaForm)[] = ['nama', 'tempatLahir', 'tanggalLahir', 'namaOrtu', 'email', 'bb', 'tb', 'lk', 'lila'];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!formData[f] || String(formData[f]).trim() === '') errs[f] = true;
    });

    // tanggal lahir harus valid dan tidak di masa depan
    if (!errs.tanggalLahir && hitungUsia(formData.tanggalLahir) === '') errs.tanggalLahir = true;

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (saving) return;

    if (!validateBalitaForm()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi dengan benar sebelum menyimpan' });
      return;
    }

    setSaving(true);
    try {
      const body = toBody(formData);

      if (formMode === 'add') {
        await babyService.create(body);
        setToast({
          visible: true,
          type: 'success',
          title: 'Berhasil Disimpan',
          message: 'Data balita telah berhasil disimpan dan dipublikasikan',
        });
      } else if (editTargetId !== null) {
        await babyService.update(editTargetId, body);
        setToast({
          visible: true,
          type: 'success',
          title: 'Berhasil Disimpan',
          message: 'Data balita telah berhasil diperbarui dan disimpan',
        });
      }

      setFormOpen(false);
      setEditTargetId(null);
      await loadBalita();
    } catch (err: any) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal Menyimpan',
        message: err?.message || 'Terjadi kesalahan saat menyimpan data balita',
      });
    } finally {
      setSaving(false);
    }
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

  const executeDelete = async () => {
    if (confirmDelete === 'balita') {
      try {
        if (editTargetId !== null) {
          await babyService.remove(editTargetId);
        }
        setFormOpen(false);
        setConfirmDelete(null);
        setEditTargetId(null);
        setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: 'Data balita telah berhasil dihapus dari sistem.' });
        await loadBalita();
      } catch (err: any) {
        setConfirmDelete(null);
        setToast({
          visible: true,
          type: 'error',
          title: 'Gagal Menghapus',
          message: err?.message || 'Terjadi kesalahan saat menghapus data balita',
        });
      }
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
        <Topbar
          title="Data Balita"
          titleColor="#D45060"
          showSearch
          searchPlaceholder="Cari nama balita..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-5 pt-4 sm:pt-5 pb-4 sm:pb-5">
          {/* PERUBAHAN 2: Mengubah max-w agar card putih lebih kecil dan isinya merapat */}
          <div className="w-full max-w-[934px] mx-auto">

            {/* Pesan error saat gagal memuat data */}
            {loadError && (
              <div className="mb-3 rounded-[10px] bg-white border border-[#DD2E44]/40 px-4 py-2 text-[12px] font-medium text-[#DD2E44]">
                {loadError}
              </div>
            )}

            <div className={`bg-white rounded-[7px] overflow-hidden ${
            loading || isDataEmpty || isFilterEmpty
              ? 'flex flex-col min-h-[460px] sm:min-h-[500px] lg:min-h-[561px]'
              : ''
              }`}>

              {/* AREA FILTER & TOMBOL TAMBAH BALITA */}
              <div className="pt-4 pb-4 px-4 sm:px-6 relative flex items-center justify-between" ref={filterRef}>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center gap-2 h-[34px] px-3 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] text-white font-semibold text-[13px] sm:text-[14px] rounded-[8px] transition-all cursor-pointer"
                  >
                    <span>{selectedFilter}</span>
                    <CaretDown className={`w-[16px] h-[16px] transition-transform ${filterOpen ? 'rotate-180' : ''}`} weight="fill" />
                  </button>
                  {filterOpen && (
                    <div className="absolute top-[40px] left-0 z-30 w-[130px] bg-white rounded-[8px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden border border-[#D9D9D9]">
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

                {/* Tombol Tambah Balita */}
                {!isDataEmpty && (
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 h-[34px] px-3 bg-[#D45060] hover:bg-[#c44454] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#D45060]/50 focus-visible:outline-none text-white font-semibold text-[13px] sm:text-[14px] rounded-[8px] transition-all duration-150 cursor-pointer"
                  >
                    <Plus className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                    <span>Balita</span>
                  </button>
                )}
              </div>

              {loading ? (
                /* KONDISI 0: SEDANG MEMUAT */
                <div className="flex-1 pb-[66px] px-4 flex items-center justify-center">
                  <p className="text-black/60 font-medium text-[13px] lg:text-[15px]">
                    Memuat data balita...
                  </p>
                </div>
              ) : isDataEmpty ? (
                /* KONDISI 1: BELUM ADA DATA BALITA */
                <div className="flex-1 pt-6 pb-[66px] px-4 flex flex-col items-center justify-center">
                  <div className="w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                    <MaskIcon
                      src="/images/baby-carriage.svg"
                      alt="Belum ada data balita"
                      color="#D45060"
                      className="w-[35px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[35px] lg:h-[35px]"
                    />
                  </div>

                  <h3 className="text-black font-bold text-[18px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-[28px] lg:leading-[32px] text-center mb-2 sm:mb-3">
                    Belum Ada Data Balita
                  </h3>

                  <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[280px] sm:max-w-[330px] lg:max-w-[380px] mb-6 sm:mb-7 lg:mb-8">
                    Data balita di posyandu Anda akan muncul di sini. Mulai tambahkan data balita pertama untuk memantau tumbuh kembangnya.
                  </p>

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
                /* KONDISI 2: TIDAK DITEMUKAN */
                <div className="flex-1 pt-6 pb-[66px] px-4 flex flex-col items-center justify-center">
                  <div className="w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                    <MaskIcon
                      src="/images/search-x.svg"
                      alt="Tidak ditemukan"
                      color="#D45060"
                      className="w-[35px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[35px] lg:h-[35px]"
                    />
                  </div>

                  <h3 className="text-black font-bold text-[18px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-[28px] lg:leading-[32px] text-center mb-2 sm:mb-3">
                    Tidak Ditemukan
                  </h3>

                  <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[280px] sm:max-w-[330px] lg:max-w-[380px]">
                    {searchQuery.trim() !== ''
                      ? `Tidak ada balita dengan nama yang mengandung "${searchQuery.trim()}". Coba kata kunci lain.`
                      : 'Tidak ada balita yang cocok dengan filter yang dipilih. Coba filter lain.'}
                  </p>
                </div>
              ) : (
                /* KONDISI 3: ADA DATA, tampilkan tabel */
                <>
                  {/* HEADER TABEL DIPERBAIKI PADDING-NYA */}
                  <div className={`bg-[#1A7772] min-h-[38px] ${TABLE_GRID} items-center px-3 sm:px-4 text-white font-bold text-[11px] sm:text-[13px] lg:text-[14px]`}>
                    <span className="pl-8">Nama</span>
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
                          className={`grid ${TABLE_GRID} items-center px-3 sm:px-4 min-h-[54px] text-black font-medium text-[11px] sm:text-[12px] lg:text-[14px] hover:bg-[#F7F8F0] transition-colors ${idx !== paginatedData.length - 1 ? 'border-b border-[#AAA6A6]' : ''}`}
                        >
                          <span className="truncate pl-8">{item.nama}</span>
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
                              <IconEdit className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]" />
                            </button>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3">
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

// ================= EXPORT: dibungkus penjaga login =================
export default function DataBalitaPage() {
  return (
    <AuthGuard role="kader">
      <DataBalitaContent />
    </AuthGuard>
  );
}