'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  AlertCircle,
  ChefHat,
} from 'lucide-react';
import Sidebar from '../../../../components/Sidebar';
import Topbar from '../../../../components/Topbar';

import type { PemeriksaanForm, ToastState, RiwayatPemeriksaan } from '../../types';
import {
  EMPTY_PEMERIKSAAN,
  KONDISI_STYLE,
  KONDISI_DOT,
} from '../../data';

import Toast from '../../components/Toast';
import PemeriksaanModal from '../../components/PemeriksaanModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { api } from '../../../../lib/api';

// ================= HELPERS =================
const BULAN_MAP: Record<string, string> = {
  Januari: '01', Februari: '02', Maret: '03', April: '04',
  Mei: '05', Juni: '06', Juli: '07', Agustus: '08',
  September: '09', Oktober: '10', November: '11', Desember: '12',
};
const BULAN_ARR = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// "11 November 2026" -> "2026-11-11"
const toSQLDate = (str: string): string => {
  const today = new Date().toISOString().split('T')[0];
  if (!str) return today;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parts = str.trim().split(' ');
  if (parts.length === 3 && BULAN_MAP[parts[1]]) {
    return `${parts[2]}-${BULAN_MAP[parts[1]]}-${parts[0].padStart(2, '0')}`;
  }
  return today;
};

// "2026-11-11" -> "11 November 2026"
const fromSQLDate = (iso: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} ${BULAN_ARR[parseInt(m, 10) - 1] || ''} ${y}`;
};

// Terima "3,4" maupun "3.4"
const toNum = (v: string): number => {
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isNaN(n) ? 0 : n;
};
const toNumOrNull = (v: string): number | null => {
  if (v === undefined || v === null || String(v).trim() === '') return null;
  return toNum(v);
};

// 3.4 -> "3,4"
const fmtNum = (v: unknown): string => {
  if (v === null || v === undefined || v === '') return '';
  return String(Number(v)).replace('.', ',');
};

const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '');

// Baris dari DB -> bentuk yang dipakai UI
const mapRow = (row: any): RiwayatPemeriksaan => ({
  id: Number(row.id),
  tanggal: fromSQLDate(row.checkup_date_str || ''),
  bb: fmtNum(row.weight_kg),
  tb: fmtNum(row.height_cm),
  lk: fmtNum(row.head_circumference_cm),
  lila: fmtNum(row.lila_cm),
  kondisi: (capitalize(row.condition_status) || 'Belum Diperiksa') as RiwayatPemeriksaan['kondisi'],
  catatan: row.kader_notes && String(row.kader_notes).trim() !== '' ? row.kader_notes : '-',
  bahanMakanan: row.recommended_food
    ? String(row.recommended_food).split(',').map((s: string) => s.trim()).filter(Boolean)
    : [],
  canEdit: Boolean(Number(row.can_edit)),
});

export default function DetailRiwayatPage() {
  const router = useRouter();
  const params = useParams();
  const balitaIdParam = Array.isArray(params.id) ? params.id[0] : params.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balita, setBalita] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [riwayat, setRiwayat] = useState<RiwayatPemeriksaan[]>([]);

  const [periksaOpen, setPeriksaOpen] = useState(false);
  const [periksaForm, setPeriksaForm] = useState<PemeriksaanForm>(EMPTY_PEMERIKSAAN);
  const [periksaErrors, setPeriksaErrors] = useState<Record<string, boolean>>({});
  const [periksaMode, setPeriksaMode] = useState<'add' | 'edit'>('add');
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [deleteTarget, setDeleteTarget] = useState<RiwayatPemeriksaan | null>(null);

  // Ambil riwayat pemeriksaan dari database
  const fetchRiwayat = useCallback(async () => {
    if (!balitaIdParam) return;
    try {
      const res = await api<any>(`/babies/${balitaIdParam}/checkups`);
      if (res.success && Array.isArray(res.data)) {
        setRiwayat(res.data.map(mapRow));
      }
    } catch (err) {
      console.error('Gagal memuat riwayat pemeriksaan:', err);
    }
  }, [balitaIdParam]);

  // Ambil detail balita dari backend berdasarkan id di URL
  useEffect(() => {
    const fetchBalitaDetail = async () => {
      if (!balitaIdParam) return;
      try {
        setLoading(true);
        const res = await api<any>('/babies/all');
        if (res.success && res.data) {
          const found = res.data.find((b: any) => Number(b.id) === Number(balitaIdParam));
          if (found) {
            let calculatedAge = found.age_months;
            if (!calculatedAge && found.birth_date) {
              const birth = new Date(found.birth_date);
              const now = new Date();
              const diffMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
              calculatedAge = Math.max(0, diffMonths);
            }

            setBalita({
              id: found.id,
              nama: found.full_name || found.name || found.nama || '',
              jenisKelamin: found.gender === 'L' || found.gender === 'Laki-laki' ? 'Laki - laki' : 'Perempuan',
              usia: `${calculatedAge || 0} Bulan`,
              tempatLahir: found.birth_place || '',
              tanggalLahir: found.birth_date || '',
              namaOrtu: found.parent_name || '',
              email: found.parent_email || '',
              kondisi: found.condition_note || found.status || 'Normal',
            });
          }
        }
        await fetchRiwayat();
      } catch (err) {
        console.error('Gagal memuat detail balita:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalitaDetail();
  }, [balitaIdParam, fetchRiwayat]);

  useEffect(() => {
    if (!toast?.visible) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleOpenPemeriksaan = () => {
    if (!balita) return;
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
    if (!balita) return;
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

  const deleteRiwayat = async (id: number) => {
    try {
      await api(`/checkups/${id}`, { method: 'DELETE' });
      await fetchRiwayat();
      setToast({
        visible: true,
        type: 'delete',
        title: 'Berhasil Dihapus',
        message: 'Data pemeriksaan telah berhasil dihapus dari sistem.',
      });
    } catch (err: any) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal Menghapus',
        message: err?.message || 'Terjadi kesalahan pada server saat menghapus.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    await deleteRiwayat(id);
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

  // Simpan ke database (tambah / edit)
  const handleSave = async () => {
    if (saving) return;

    if (!validateForm()) {
      setToast({ visible: true, type: 'error', title: 'Data Belum Lengkap', message: 'Mohon lengkapi semua kolom yang wajib diisi sebelum menyimpan' });
      return;
    }

    const babyId = Number(balita?.id);
    if (!Number.isInteger(babyId) || babyId <= 0) {
      setToast({ visible: true, type: 'error', title: 'Gagal', message: 'Data balita tidak ditemukan.' });
      return;
    }

    const matchAge = String(periksaForm.usia).match(/\d+/);
    const babyAgeMonths = matchAge ? parseInt(matchAge[0], 10) : 0;

    const kondLower = String(periksaForm.kondisi).toLowerCase();
    let conditionStatus: 'normal' | 'berisiko' | 'stunting' = 'normal';
    if (kondLower.includes('berisiko')) conditionStatus = 'berisiko';
    else if (kondLower.includes('stunting')) conditionStatus = 'stunting';

    const payload = {
      babyId,
      babyAgeMonths,
      checkupDate: toSQLDate(periksaForm.tanggalPemeriksaan),
      weightKg: toNum(periksaForm.bb),
      heightCm: toNum(periksaForm.tb),
      headCircumferenceCm: toNumOrNull(periksaForm.lk),
      lilaCm: toNumOrNull(periksaForm.lila),
      kaderNotes: periksaForm.catatan || '',
      recommendedFood: Array.isArray(periksaForm.bahanMakanan) ? periksaForm.bahanMakanan.join(', ') : '',
      conditionStatus,
    };

    setSaving(true);
    try {
      if (periksaMode === 'add') {
        await api('/checkups', { method: 'POST', body: payload });
        setToast({
          visible: true,
          type: 'success',
          title: 'Berhasil Disimpan',
          message: 'Data pemeriksaan telah berhasil ditambahkan',
        });
      } else if (editTargetId !== null) {
        await api(`/checkups/${editTargetId}`, { method: 'PUT', body: payload });
        setToast({
          visible: true,
          type: 'success',
          title: 'Berhasil Disimpan',
          message: 'Data pemeriksaan telah berhasil diperbarui dan disimpan',
        });
      }

      setPeriksaOpen(false);
      setEditTargetId(null);
      await fetchRiwayat();
    } catch (err: any) {
      setToast({
        visible: true,
        type: 'error',
        title: 'Gagal Menyimpan',
        message: err?.message || 'Terjadi kesalahan pada server saat menyimpan.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFromModal = async () => {
    if (confirm('Yakin ingin menghapus data pemeriksaan ini?')) {
      const id = editTargetId;
      setPeriksaOpen(false);
      setEditTargetId(null);
      if (id !== null) await deleteRiwayat(id);
    }
  };

  if (loading || !balita) {
    return (
      <div className="h-screen w-full bg-[#B3EAE8] flex items-center justify-center">
        <p className="text-black font-semibold text-[16px]">Memuat data balita...</p>
      </div>
    );
  }

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

        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-5">
          <div className="bg-white rounded-[7px] px-6 pt-5 pb-6">

            <button
              type="button"
              onClick={() => router.push('/unggah-data')}
              className="flex items-center gap-2.5 mb-4 cursor-pointer group"
            >
              <span className="w-[26px] h-[26px] rounded-full bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-colors">
                <ArrowLeft className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[#8F8F8F] font-bold text-[14px] leading-[18px] group-hover:text-[#D45060] transition-colors">
                Kembali
              </span>
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-[44px] h-[44px] rounded-full bg-[#FCEBD5] flex items-center justify-center shrink-0">
                <span className="text-[#D45060] font-bold text-[18px] leading-[22px]">
                  {balita.nama.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-black font-semibold text-[15px] leading-[18px]">{balita.nama}</h2>
                <p className="mt-1 text-[#8F8F8F] font-bold text-[12px] leading-[14px]">
                  {balita.jenisKelamin}
                  <span className="mx-[6px]">•</span>
                  {balita.usia}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenPemeriksaan}
                className="h-[34px] px-3.5 bg-[#D45060] hover:bg-[#c44454] rounded-[9px] text-white font-semibold text-[13px] leading-[16px] flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Plus className="w-[18px] h-[18px]" strokeWidth={2.5} />
                <span>Pemeriksaan</span>
              </button>
            </div>

            <h3 className="text-black/70 font-bold text-[14px] leading-[18px] mb-2.5">Riwayat Pemeriksaan</h3>

            <div className="w-full bg-[#FFC2B4]/50 rounded-[8px] px-3.5 py-2.5 flex items-center gap-2.5 mb-5">
              <AlertCircle className="w-[16px] h-[16px] text-[#BE6D15] shrink-0" strokeWidth={2} />
              <p className="text-[#BE6D15]/90 font-medium text-[12px] leading-[15px]">
                Pemeriksaan hanya dapat diedit/dihapus dalam <span className="font-bold">24 jam</span> setelah disimpan
              </p>
            </div>

            <div className="relative">
              {riwayat.length === 0 ? (
                <div className="h-[100px] flex items-center justify-center text-[#797777] font-medium text-[13px]">
                  Belum ada riwayat pemeriksaan.
                </div>
              ) : (
                riwayat.map((item) => {
                  return (
                    <div key={item.id} className="relative flex gap-4 pb-5">
                      <div className="relative flex flex-col items-center shrink-0 w-[12px]">
                        <div className={`w-[12px] h-[12px] rounded-full ${KONDISI_DOT[item.kondisi]} z-10 relative`} />
                        <div
                          className={`absolute top-[12px] bottom-[-20px] left-1/2 -translate-x-1/2 w-[1.5px] ${
                            item.kondisi === 'Normal' ? 'bg-[#66A0C2]' : 'bg-[#FFEAA2]'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[#8F8F8F] font-bold text-[10px] leading-[12px] mb-1">{item.tanggal}</p>
                          <p className="text-black/80 font-semibold text-[12px] leading-[14px] mb-2">
                            BB {item.bb} kg<span className="mx-[5px]">•</span>TB {item.tb} cm<span className="mx-[5px]">•</span>LK {item.lk} cm<span className="mx-[5px]">•</span>LiLA {item.lila} cm
                          </p>
                          <div className="mb-2">
                            <span className={`inline-flex min-w-[68px] h-[22px] px-2 items-center justify-center rounded-[5px] font-bold text-[10px] leading-[12px] ${KONDISI_STYLE[item.kondisi]}`}>
                              {item.kondisi}
                            </span>
                          </div>
                          <p className="text-[#8F8F8F] font-bold text-[12px] leading-[14px] mb-2">
                            Catatan: {item.catatan}
                          </p>
                          {item.bahanMakanan.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {item.bahanMakanan.map((bahan) => (
                                <span key={bahan} className="h-[22px] px-2.5 bg-[#1A7772] rounded-[8px] text-white font-bold text-[10px] leading-[12px] flex items-center gap-1.5">
                                  <ChefHat className="w-[12px] h-[12px]" strokeWidth={2} />
                                  <span>{bahan}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          {item.diedit && (
                            <p className="text-[#AAA6A6] font-semibold text-[10px] leading-[12px]">{item.diedit}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <button
                            type="button"
                            disabled={!item.canEdit}
                            onClick={() => handleEditRiwayat(item)}
                            title={item.canEdit ? 'Edit' : 'Hanya bisa diedit dalam 24 jam'}
                            className={`w-[28px] h-[28px] rounded-[7px] border flex items-center justify-center transition-colors ${item.canEdit ? 'bg-white border-black/70 hover:bg-[#F7F8F0] cursor-pointer' : 'bg-white border-[#AAA6A6] cursor-not-allowed'}`}
                          >
                            <img
                              src="/images/edit-pencil.svg"
                              alt="Edit"
                              className="w-[15px] h-[15px] object-contain"
                              style={{
                                filter: item.canEdit
                                  ? 'brightness(0) opacity(0.7)'
                                  : 'brightness(0) invert(73%) sepia(3%) saturate(168%) hue-rotate(314deg) brightness(91%) contrast(85%)',
                              }}
                            />
                          </button>
                          <button
                            type="button"
                            disabled={!item.canEdit}
                            onClick={() => handleOpenDelete(item)}
                            title={item.canEdit ? 'Hapus' : 'Hanya bisa dihapus dalam 24 jam'}
                            className={`w-[28px] h-[28px] rounded-[7px] border flex items-center justify-center transition-colors ${item.canEdit ? 'bg-white border-[#FF0020] hover:bg-[#D45060]/5 cursor-pointer' : 'bg-white border-[#AAA6A6] cursor-not-allowed'}`}
                          >
                            <img
                              src="/images/trash-fill.svg"
                              alt="Hapus"
                              className="w-[15px] h-[15px] object-contain"
                              style={{
                                filter: item.canEdit
                                  ? 'brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7463%) hue-rotate(351deg) brightness(101%) contrast(106%)'
                                  : 'brightness(0) invert(73%) sepia(3%) saturate(168%) hue-rotate(314deg) brightness(91%) contrast(85%)',
                              }}
                            />
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