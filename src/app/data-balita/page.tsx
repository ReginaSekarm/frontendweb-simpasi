'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { CaretDown } from '@phosphor-icons/react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import type { Balita, BalitaForm, PemeriksaanForm, FilterType, ToastState, ConfirmDeleteType } from './types';
import { BALITA_DATA, FILTER_OPTIONS, KONDISI_STYLE, EMPTY_FORM, EMPTY_PEMERIKSAAN } from './data';

import Toast from './_components/Toast';
import ConfirmDeleteModal from './_components/ConfirmDeleteModal';
import BalitaFormModal from './_components/BalitaFormModal';
import PemeriksaanModal from './_components/PemeriksaanModal';

export default function DataBalitaPage() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('Semua');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formData, setFormData] = useState<BalitaForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Data dummy 
  const [balitaList, setBalitaList] = useState<Balita[]>(BALITA_DATA);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  const [periksaOpen, setPeriksaOpen] = useState(false);
  const [periksaBalita, setPeriksaBalita] = useState<Balita | null>(null);
  const [periksaForm, setPeriksaForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [periksaErrors, setPeriksaErrors] = useState<Record<string, boolean>>({});

  const [toast, setToast] = useState<ToastState>(null);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteType>(null);
  const filterRef = useRef<HTMLDivElement>(null);

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

  const filteredData = selectedFilter === 'Semua' ? balitaList : balitaList.filter((b) => b.kondisi === selectedFilter);

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

  // ===== Handlers Pemeriksaan =====
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

  // ===== Eksekusi hapus =====
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
      <Sidebar activePage="data-balita" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Data Balita" titleColor="#D45060" showSearch searchPlaceholder="Search........" />

        <div className="flex-1 overflow-y-auto px-[34px] pt-[52px] pb-8">
          <div className="flex justify-end mb-[22px]">
            <button type="button" onClick={handleOpenAdd} className="flex items-center gap-[13px] h-[79px] px-[26px] bg-[#D45060] hover:bg-[#c44454] text-white font-semibold text-[22.5px] rounded-[13.5px] transition-colors active:scale-[0.98] cursor-pointer">
              <Plus className="w-[39px] h-[39px]" strokeWidth={2.5} />
              <span>Balita</span>
            </button>
          </div>

          <div className="bg-white rounded-[7px] overflow-hidden">
            <div className="pt-[15px] pb-[24px] pl-[38px] relative" ref={filterRef}>
              <button type="button" onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-[13px] h-[42px] px-[13px] bg-[#D45060] hover:bg-[#c44454] text-white font-semibold text-[22.5px] rounded-[9px] transition-colors cursor-pointer">
                <span>{selectedFilter}</span>
                <CaretDown className={`w-[24px] h-[24px] transition-transform ${filterOpen ? 'rotate-180' : ''}`} weight="fill" />
              </button>
              {filterOpen && (
                <div className="absolute top-[60px] left-[38px] z-30 w-[150px] bg-white rounded-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden border border-[#D9D9D9]">
                  {FILTER_OPTIONS.map((opt) => (
                    <button key={opt} type="button" onClick={() => { setSelectedFilter(opt); setFilterOpen(false); }} className={`w-full text-left px-[14px] py-[10px] text-[16px] font-semibold transition-colors cursor-pointer ${selectedFilter === opt ? 'text-[#D45060] bg-[#FCEBD5]' : 'text-[#797777] hover:bg-[#F7F8F0]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#1A7772] h-[45px] grid grid-cols-[1.2fr_1.2fr_1fr_1.2fr_1.2fr] items-center px-[26px] text-white font-bold text-[22.5px]">
              <span className="pl-[57px]">Nama</span>
              <span className="text-center">Jenis Kelamin</span>
              <span className="text-center">Usia</span>
              <span className="text-center">Kondisi</span>
              <span className="text-center">Aksi</span>
            </div>

            <div>
              {filteredData.length === 0 ? (
                <div className="h-[140px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                  Tidak ada data untuk kondisi &quot;{selectedFilter}&quot;.
                </div>
              ) : (
                filteredData.map((item, idx) => (
                  <div key={item.id} className={`grid grid-cols-[1.2fr_1.2fr_1fr_1.2fr_1.2fr] items-center px-[26px] h-[70px] text-black font-medium text-[20.25px] ${idx !== filteredData.length - 1 ? 'border-b border-[#AAA6A6]' : ''}`}>
                    <span className="pl-[21px]">{item.nama}</span>
                    <span className="text-center">{item.jenisKelamin}</span>
                    <span className="text-center">{item.usia}</span>
                    <span className="flex justify-center">
                      <span className={`min-w-[101px] min-h-[32px] px-2 py-1 flex items-center justify-center rounded-[6px] font-bold text-[14.625px] leading-[18px] text-center ${KONDISI_STYLE[item.kondisi]}`}>
                        {item.kondisi}
                      </span>
                    </span>
                    <span className="flex items-center justify-center gap-[13px]">
                      <button type="button" aria-label={`Edit ${item.nama}`} onClick={() => handleOpenEdit(item)} className="text-black/70 hover:text-[#D45060] transition-colors cursor-pointer">
                        <Pencil className="w-[24px] h-[24px]" strokeWidth={2.2} />
                      </button>
                      <button type="button" onClick={() => handleOpenPeriksa(item)} className="min-w-[101px] h-[33px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[6px] text-black/70 font-semibold text-[18px] transition-colors cursor-pointer">
                        Periksa
                      </button>
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-[5px] pr-[30px] py-[15px]">
              <button type="button" aria-label="Sebelumnya" className="w-[29px] h-[34px] rounded-[4.5px] bg-[#D9D9D9] hover:bg-[#c9c9c9] flex items-center justify-center transition-colors">
                <ChevronLeft className="w-[18px] h-[18px] text-[#8F8F8F]" strokeWidth={2.5} />
              </button>
              <button type="button" aria-label="Berikutnya" className="w-[29px] h-[34px] rounded-[4.5px] bg-[#D9D9D9] border border-black hover:bg-[#c9c9c9] flex items-center justify-center transition-colors">
                <ChevronRight className="w-[18px] h-[18px] text-black" strokeWidth={2.5} />
              </button>
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