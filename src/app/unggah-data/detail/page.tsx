'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  ChefHat,
} from 'lucide-react';
import Sidebar from '../../../components/Sidebar';
import Topbar from '../../../components/Topbar';

import type { PemeriksaanForm, ToastState, RiwayatPemeriksaan } from '../_types';
import {
  BALITA_DATA,
  RIWAYAT_MAP,
  EMPTY_PEMERIKSAAN,
  KONDISI_STYLE,
  KONDISI_DOT,
} from '../_data';

import Toast from '../_components/Toast';
import PemeriksaanModal from '../_components/PemeriksaanModal';
import ConfirmDeleteModal from './_components/ConfirmDeleteModal';

function DetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const balitaIdParam = searchParams.get('balitaId');

  // ✅ Balita dari DUMMY (BALITA_DATA)
  const balita = BALITA_DATA.find((b) => b.id === Number(balitaIdParam)) || BALITA_DATA[0];

  // ✅ Riwayat dari DUMMY (RIWAYAT_MAP) — state lokal, biar bisa nambah/edit/hapus
  const [riwayat, setRiwayat] = useState<RiwayatPemeriksaan[]>(
    RIWAYAT_MAP[balita.id] || []
  );

  const [periksaOpen, setPeriksaOpen] = useState(false);
  const [periksaForm, setPeriksaForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [periksaErrors, setPeriksaErrors] = useState<Record<string, boolean>>({});
  const [periksaMode, setPeriksaMode] = useState<'add' | 'edit'>('add');
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [deleteTarget, setDeleteTarget] = useState<RiwayatPemeriksaan | null>(null);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleOpenPemeriksaan = () => {
    setPeriksaMode('add');
    setEditTargetId(null);
    setPeriksaForm({
      ...EMPTY_PEMERIKSAAN,
      nama: balita.nama,
      jenisKelamin: balita.jenisKelamin,
      usia: balita.usia,
      tempatLahir: balita.tempatLahir,
      tanggalLahir: balita.tanggalLahir,
      namaOrtu: balita.namaOrtu,
      email: balita.email,
      bahanMakanan: [],
    });
    setPeriksaErrors({});
    setPeriksaOpen(true);
  };

  const handleEditRiwayat = (item: RiwayatPemeriksaan) => {
    setPeriksaMode('edit');
    setEditTargetId(item.id);
    setPeriksaForm({
      nama: balita.nama,
      jenisKelamin: balita.jenisKelamin,
      usia: balita.usia,
      tempatLahir: balita.tempatLahir,
      tanggalLahir: balita.tanggalLahir,
      namaOrtu: balita.namaOrtu,
      email: balita.email,
      bb: item.bb,
      tb: item.tb,
      lk: item.lk,
      lila: item.lila,
      catatan: item.catatan === '-' ? '' : item.catatan,
      bahanMakanan: item.bahanMakanan,
      kondisi: item.kondisi === 'Belum Diperiksa' ? 'Normal' : item.kondisi,
      tanggalPemeriksaan: item.tanggal,
    });
    setPeriksaErrors({});
    setPeriksaOpen(true);
  };

  const handleOpenDelete = (item: RiwayatPemeriksaan) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setRiwayat((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    setToast({
      visible: true,
      type: 'delete',
      title: 'Berhasil Dihapus',
      message: 'Data pemeriksaan telah berhasil dihapus dari sistem.',
    });
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

  const validateForm = (): boolean => {
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

  const handleSave = () => {
    if (!validateForm()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan' });
      return;
    }

    if (periksaMode === 'add') {
      const newItem: RiwayatPemeriksaan = {
        id: Date.now(),
        tanggal: periksaForm.tanggalPemeriksaan,
        bb: periksaForm.bb,
        tb: periksaForm.tb,
        lk: periksaForm.lk,
        lila: periksaForm.lila,
        kondisi: periksaForm.kondisi === '' ? 'Belum Diperiksa' : periksaForm.kondisi,
        catatan: periksaForm.catatan.trim() === '' ? '-' : periksaForm.catatan,
        bahanMakanan: periksaForm.bahanMakanan,
        canEdit: true,
      };

      setRiwayat((prev) => [newItem, ...prev]);

      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil Disimpan',
        message: 'Data pemeriksaan telah berhasil ditambahkan',
      });
    } else {
      if (editTargetId !== null) {
        setRiwayat((prev) =>
          prev.map((r) =>
            r.id === editTargetId
              ? {
                  ...r,
                  tanggal: periksaForm.tanggalPemeriksaan,
                  bb: periksaForm.bb,
                  tb: periksaForm.tb,
                  lk: periksaForm.lk,
                  lila: periksaForm.lila,
                  kondisi: periksaForm.kondisi === '' ? 'Belum Diperiksa' : periksaForm.kondisi,
                  catatan: periksaForm.catatan.trim() === '' ? '-' : periksaForm.catatan,
                  bahanMakanan: periksaForm.bahanMakanan,
                  diedit: `Diedit ${new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
                }
              : r
          )
        );
      }

      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil Disimpan',
        message: 'Data pemeriksaan telah berhasil diperbarui dan disimpan',
      });
    }

    setPeriksaOpen(false);
    setEditTargetId(null);
  };

  const handleDeleteFromModal = () => {
    if (confirm('Yakin ingin menghapus data pemeriksaan ini?')) {
      if (editTargetId !== null) {
        setRiwayat((prev) => prev.filter((r) => r.id !== editTargetId));
      }
      setPeriksaOpen(false);
      setEditTargetId(null);
      setToast({ visible: true, type: 'delete', title: 'Berhasil Dihapus', message: 'Data pemeriksaan telah berhasil dihapus dari sistem.' });
    }
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="unggah-data" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar title="Unggah Resep & Pemeriksaan" titleColor="#D45060" />

        <div className="flex-1 overflow-y-auto px-[37px] pt-[30px] pb-[27px]">
          <div className="bg-white rounded-[7px] px-[50px] pt-[35px] pb-[40px]">
            {/* Tombol Kembali */}
            <button
              type="button"
              onClick={() => router.push('/unggah-data')}
              className="flex items-center gap-[14px] mb-[26px] cursor-pointer group"
            >
              <span className="w-[38px] h-[38px] rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                <ArrowLeft className="w-[22px] h-[22px] text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[#8F8F8F] font-bold text-[22px] leading-[27px] group-hover:text-[#D45060] transition-colors">
                Kembali
              </span>
            </button>

            {/* Card Balita */}
            <div className="flex items-center gap-[20px] mb-[40px]">
              <div className="w-[67px] h-[67px] rounded-full bg-[#FCEBD5] flex items-center justify-center shrink-0">
                <span className="text-[#D45060] font-bold text-[27px] leading-[33px]">
                  {balita.nama.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-black font-semibold text-[22.5px] leading-[27px]">{balita.nama}</h2>
                <p className="mt-[6px] text-[#8F8F8F] font-bold text-[16.87px] leading-[20px]">
                  {balita.jenisKelamin}
                  <span className="mx-[10px]">•</span>
                  {balita.usia}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenPemeriksaan}
                className="h-[46px] px-[16px] bg-[#D45060] hover:bg-[#c44454] rounded-[13.5px] text-white font-semibold text-[20.25px] leading-[25px] flex items-center gap-[10px] transition-colors active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-[29px] h-[29px]" strokeWidth={2.5} />
                <span>Pemeriksaan</span>
              </button>
            </div>

            {/* Heading Riwayat */}
            <h3 className="text-black/70 font-bold text-[20.25px] leading-[25px] mb-[14px]">Riwayat Pemeriksaan</h3>

            {/* Banner Info */}
            <div className="w-full bg-[#FFC2B4]/50 rounded-[12px] px-[18px] py-[13px] flex items-center gap-[14px] mb-[36px]">
              <AlertCircle className="w-[24px] h-[24px] text-[#BE6D15] shrink-0" strokeWidth={2} />
              <p className="text-[#BE6D15]/90 font-medium text-[18px] leading-[22px]">
                Pemeriksaan hanya dapat diedit/dihapus dalam <span className="font-bold">24 jam</span> setelah disimpan
              </p>
            </div>

            {/* Timeline Riwayat */}
            <div className="relative">
              {riwayat.length === 0 ? (
                <div className="h-[140px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                  Belum ada riwayat pemeriksaan.
                </div>
              ) : (
                riwayat.map((item) => {
                  return (
                    <div key={item.id} className="relative flex gap-[28px] pb-[36px]">
                      <div className="relative flex flex-col items-center shrink-0 w-[18px]">
                        <div className={`w-[18px] h-[18px] rounded-full ${KONDISI_DOT[item.kondisi]} z-10 relative`} />
                        <div
                          className={`absolute top-[18px] bottom-[-36px] left-1/2 -translate-x-1/2 w-[2.25px] ${
                            item.kondisi === 'Normal' ? 'bg-[#66A0C2]' : 'bg-[#FFEAA2]'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex items-start justify-between gap-[20px]">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#8F8F8F] font-bold text-[14.62px] leading-[18px] mb-[6px]">{item.tanggal}</p>
                          <p className="text-black/80 font-semibold text-[16.87px] leading-[20px] mb-[10px]">
                            BB {item.bb} kg<span className="mx-[8px]">•</span>TB {item.tb} cm<span className="mx-[8px]">•</span>LK {item.lk} cm<span className="mx-[8px]">•</span>LiLA {item.lila} cm
                          </p>
                          <div className="mb-[10px]">
                            <span className={`inline-flex min-w-[101px] h-[33px] px-3 items-center justify-center rounded-[6px] font-bold text-[14.62px] leading-[18px] ${KONDISI_STYLE[item.kondisi]}`}>
                              {item.kondisi}
                            </span>
                          </div>
                          <p className="text-[#8F8F8F] font-bold text-[16.87px] leading-[20px] mb-[10px]">
                            Catatan: {item.catatan}
                          </p>
                          {item.bahanMakanan.length > 0 && (
                            <div className="flex flex-wrap gap-[12px] mb-[10px]">
                              {item.bahanMakanan.map((bahan) => (
                                <span key={bahan} className="h-[33px] px-[18px] bg-[#1A7772] rounded-[11px] text-white font-bold text-[14.62px] leading-[18px] flex items-center gap-[10px]">
                                  <ChefHat className="w-[18px] h-[18px]" strokeWidth={2} />
                                  <span>{bahan}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          {item.diedit && (
                            <p className="text-[#AAA6A6] font-semibold text-[13.5px] leading-[16px]">{item.diedit}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-[14px] shrink-0">
                          <button
                            type="button"
                            disabled={!item.canEdit}
                            onClick={() => handleEditRiwayat(item)}
                            title={item.canEdit ? 'Edit' : 'Hanya bisa diedit dalam 24 jam'}
                            className={`w-[39px] h-[39px] rounded-[9px] border flex items-center justify-center transition-colors ${item.canEdit ? 'bg-white border-black/70 hover:bg-[#F7F8F0] cursor-pointer' : 'bg-white border-[#AAA6A6] cursor-not-allowed'}`}
                          >
                            <Pencil className={`w-[22px] h-[22px] ${item.canEdit ? 'text-black/70' : 'text-[#AAA6A6]'}`} strokeWidth={2} />
                          </button>
                          <button
                            type="button"
                            disabled={!item.canEdit}
                            onClick={() => handleOpenDelete(item)}
                            title={item.canEdit ? 'Hapus' : 'Hanya bisa dihapus dalam 24 jam'}
                            className={`w-[39px] h-[39px] rounded-[9px] border flex items-center justify-center transition-colors ${item.canEdit ? 'bg-white border-[#FF0020] hover:bg-[#D45060]/5 cursor-pointer' : 'bg-white border-[#AAA6A6] cursor-not-allowed'}`}
                          >
                            <Trash2 className={`w-[22px] h-[22px] ${item.canEdit ? 'text-[#FF0020]' : 'text-[#AAA6A6]'}`} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {periksaOpen && (
        <PemeriksaanModal
          data={periksaForm}
          errors={periksaErrors}
          mode={periksaMode}
          onChange={handleChangePeriksa}
          onToggleBahan={handleToggleBahan}
          onClose={() => setPeriksaOpen(false)}
          onSave={handleSave}
          onDelete={handleDeleteFromModal}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {toast?.visible && (
        <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default function DetailRiwayatPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#B3EAE8]" />}>
      <DetailContent />
    </Suspense>
  );
}