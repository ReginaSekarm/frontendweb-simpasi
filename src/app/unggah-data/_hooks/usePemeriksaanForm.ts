'use client';

import { useState } from 'react';
import type { Balita, PemeriksaanForm, ToastState } from '../_types';
import { EMPTY_PEMERIKSAAN } from '../_data';

type SetToast = React.Dispatch<React.SetStateAction<ToastState>>;

export function usePemeriksaanForm(setToast: SetToast) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // ===== Buka modal pemeriksaan baru untuk balita =====
  const openNew = (balita: Balita) => {
    setForm({
      ...EMPTY_PEMERIKSAAN,
      nama: balita.nama,
      jenisKelamin: balita.jenisKelamin,
      usia: balita.usia,
      tempatLahir: balita.tempatLahir,
      tanggalLahir: balita.tanggalLahir,
      namaOrtu: balita.namaOrtu,
      email: balita.email,
    });
    setErrors({});
    setOpen(true);
  };

  // ===== Change field =====
  const handleChange = (field: keyof PemeriksaanForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  // ===== Toggle bahan makanan =====
  const handleToggleBahan = (bahan: string) => {
    setForm((prev) => {
      const isActive = prev.bahanMakanan.includes(bahan);
      return {
        ...prev,
        bahanMakanan: isActive ? prev.bahanMakanan.filter((b) => b !== bahan) : [...prev.bahanMakanan, bahan],
      };
    });
  };

  // ===== Validate =====
  const validate = (): boolean => {
    const required: (keyof PemeriksaanForm)[] = [
      'nama', 'jenisKelamin', 'usia', 'tempatLahir', 'tanggalLahir', 'namaOrtu', 'email',
      'bb', 'tb', 'lk', 'lila', 'tanggalPemeriksaan',
    ];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!form[f] || String(form[f]).trim() === '') errs[f] = true;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===== Simpan =====
  const handleSave = () => {
    if (!validate()) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Data Belum Lengkap',
        message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan',
      });
      return;
    }
    console.log('Simpan pemeriksaan:', form);
    setOpen(false);
    setToast({
      visible: true,
      type: 'success',
      title: 'Berhasil Disimpan',
      message: 'Data pemeriksaan telah berhasil diperbarui dan disimpan',
    });
  };

  // ===== Hapus =====
  const handleDelete = () => {
    if (confirm('Yakin ingin menghapus data pemeriksaan ini?')) {
      setOpen(false);
      setToast({
        visible: true,
        type: 'delete',
        title: 'Berhasil Dihapus',
        message: 'Data pemeriksaan telah berhasil dihapus dari sistem.',
      });
    }
  };

  return {
    open,
    setOpen,
    form,
    errors,
    openNew,
    handleChange,
    handleToggleBahan,
    handleSave,
    handleDelete,
  };
}