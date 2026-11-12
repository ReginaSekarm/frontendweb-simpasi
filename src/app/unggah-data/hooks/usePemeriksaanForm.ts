'use client';

import { useState } from 'react';
import type { Balita, PemeriksaanForm, ToastState } from '../types';
import { EMPTY_PEMERIKSAAN } from '../data';
import { api } from '../../../lib/api';

type SetToast = React.Dispatch<React.SetStateAction<ToastState>>;

export function usePemeriksaanForm(setToast: SetToast) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [babyId, setBabyId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Buka modal pemeriksaan baru untuk balita
  const openNew = (balita: Balita) => {
    const id = Number((balita as unknown as { id?: number }).id);
    setBabyId(Number.isInteger(id) && id > 0 ? id : null);
    setForm({
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
    setErrors({});
    setOpen(true);
  };

  const handleChange = (field: keyof PemeriksaanForm, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleToggleBahan = (bahan: string) => {
    setForm((prev) => {
      const isActive = prev.bahanMakanan.includes(bahan);
      return {
        ...prev,
        bahanMakanan: isActive ? prev.bahanMakanan.filter((b) => b !== bahan) : [...prev.bahanMakanan, bahan],
      };
    });
  };

  // Helper konversi tanggal tampilan (misal: "9 November 2026") ke Format SQL (YYYY-MM-DD)
  const parseToSQLDate = (dateStr: string): string => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    if (dateStr.includes('-')) return dateStr;
    
    const bulanMap: Record<string, string> = {
      Januari: '01', Februari: '02', Maret: '03', April: '04',
      Mei: '05', Juni: '06', Juli: '07', Agustus: '08',
      September: '09', Oktober: '10', November: '11', Desember: '12',
    };
    const parts = dateStr.trim().split(' ');
    if (parts.length === 3 && bulanMap[parts[1]]) {
      const day = parts[0].padStart(2, '0');
      const month = bulanMap[parts[1]];
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
  };

  // Simpan ke backend
  const handleSave = async () => {
    if (saving) return;

    const required: (keyof PemeriksaanForm)[] = [
      'nama', 'jenisKelamin', 'usia', 'tempatLahir', 'tanggalLahir', 'namaOrtu', 'email',
      'bb', 'tb', 'lk', 'lila', 'tanggalPemeriksaan',
    ];
    const errs: Record<string, boolean> = {};
    required.forEach((f) => {
      if (!form[f] || String(form[f]).trim() === '') errs[f] = true;
    });

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Data Belum Lengkap',
        message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan',
      });
      return;
    }

    if (babyId === null) {
      setToast({ visible: true, type: 'error', title: 'Gagal', message: 'Data balita tidak ditemukan.' });
      return;
    }

    const matchAge = String(form.usia).match(/\d+/);
    const babyAgeMonths = matchAge ? parseInt(matchAge[0], 10) : 0;

    let conditionStatus: 'normal' | 'berisiko' | 'stunting' = 'normal';
    const kondLower = String(form.kondisi).toLowerCase();
    if (kondLower.includes('berisiko')) conditionStatus = 'berisiko';
    else if (kondLower.includes('stunting')) conditionStatus = 'stunting';

    const payload = {
      babyId: babyId,
      babyAgeMonths: babyAgeMonths,
      checkupDate: parseToSQLDate(form.tanggalPemeriksaan),
      weightKg: parseFloat(form.bb) || 0,
      heightCm: parseFloat(form.tb) || 0,
      headCircumferenceCm: form.lk ? parseFloat(form.lk) : null,
      lilaCm: form.lila ? parseFloat(form.lila) : null,
      kaderNotes: form.catatan || '',
      recommendedFood: Array.isArray(form.bahanMakanan) ? form.bahanMakanan.join(', ') : '',
      conditionStatus: conditionStatus,
    };

    setSaving(true);
    try {
      await api('/checkups', { method: 'POST', body: payload });
      setOpen(false);
      setToast({
        visible: true,
        type: 'success',
        title: 'Berhasil Disimpan',
        message: 'Data pemeriksaan telah berhasil ditambahkan',
      });
    } catch (err: any) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal Menyimpan',
        message: err.message || 'Terjadi kesalahan pada server saat menyimpan.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setOpen(false);
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