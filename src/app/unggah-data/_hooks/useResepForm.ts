'use client';

import { useState } from 'react';
import type { Resep, TambahResepForm, ToastState } from '../_types';
import { EMPTY_TAMBAH_RESEP, mapUsiaKeForm } from '../_data';

type SetToast = React.Dispatch<React.SetStateAction<ToastState>>;

export function useResepForm(
  resepList: Resep[],
  setResepList: React.Dispatch<React.SetStateAction<Resep[]>>,
  setToast: SetToast
) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<TambahResepForm>(EMPTY_TAMBAH_RESEP);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  // ===== Buka modal tambah =====
  const handleAdd = () => {
    setForm({ ...EMPTY_TAMBAH_RESEP });
    setErrors({});
    setEditTargetId(null);
    setOpen(true);
  };

  // ===== Buka modal edit =====
  const handleEdit = (resep: Resep) => {
    setForm({
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
    setErrors({});
    setEditTargetId(resep.id);
    setOpen(true);
  };

  // ===== Change field =====
  const handleChange = (field: keyof TambahResepForm, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  // ===== Hapus resep =====
  const handleDelete = (resep: Resep) => {
    if (confirm(`Yakin ingin menghapus resep "${resep.nama}"?`)) {
      setResepList((prev) => prev.filter((r) => r.id !== resep.id));
      setToast({
        visible: true,
        type: 'delete',
        title: 'Berhasil Dihapus',
        message: `Resep "${resep.nama}" telah berhasil dihapus dari sistem.`,
      });
    }
  };

  // ===== Validate =====
  const validate = (): boolean => {
    const required: (keyof TambahResepForm)[] = ['nama', 'usia', 'bahan', 'langkah', 'kalori'];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!form[f] || String(form[f]).trim() === '') errs[f] = true;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== Build partial resep dari form =====
  const build = (status: 'Draft' | 'Terpublikasi', img?: string): Partial<Resep> => ({
    nama: form.nama,
    usia: form.usia,
    kalori: form.kalori,
    status,
    image: form.imagePreview || img || '/images/placeholder.png',
    bahan: form.bahan,
    langkah: form.langkah,
    protein: form.protein,
    karbohidrat: form.karbohidrat,
    lemak: form.lemak,
    tips: form.tips,
  });

  // ===== Simpan dengan status =====
  const saveWithStatus = (status: 'Draft' | 'Terpublikasi') => {
    if (!validate()) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Data Belum Lengkap',
        message: `Mohon lengkapi semua kolom yang wajib diisi sebelum ${status === 'Draft' ? 'menyimpan draft' : 'mempublikasikan'}`,
      });
      return;
    }

    if (editTargetId !== null) {
      // Update resep existing
      setResepList((prev) =>
        prev.map((r) => (r.id === editTargetId ? { ...r, ...build(status, r.image) } : r))
      );
    } else {
      // Tambah resep baru
      const newResep: Resep = {
        id: Date.now(),
        ...build(status),
        commentsCount: 0,
      } as Resep;
      setResepList((prev) => [newResep, ...prev]);
    }

    setToast({
      visible: true,
      type: 'success',
      title: status === 'Draft' ? 'Berhasil Disimpan' : 'Berhasil Dipublikasikan',
      message: `Resep "${form.nama}" telah berhasil ${status === 'Draft' ? 'disimpan sebagai draft' : 'dipublikasikan'}`,
    });

    setOpen(false);
    setEditTargetId(null);
  };

  return {
    open,
    setOpen,
    form,
    errors,
    editTargetId,
    handleAdd,
    handleEdit,
    handleChange,
    handleDelete,
    handlePublish: () => saveWithStatus('Terpublikasi'),
    handleSaveDraft: () => saveWithStatus('Draft'),
  };
}