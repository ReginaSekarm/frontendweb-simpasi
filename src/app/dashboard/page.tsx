'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { IconBowlSpoon } from '@tabler/icons-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

import {
  loadAktivitas,
  loadJSON,
  timeAgo,
  type Aktivitas,
} from '../../lib/simpasi-store';

// ================= TYPES =================
type BalitaLite = {
  id: number;
  nama: string;
  usia: string;
  kondisi: string;
};

type ResepLite = {
  id: number;
  nama: string;
  status: string;
};

// ================= STYLE =================
const STATUS_STYLE: Record<string, string> = {
  Draft: 'bg-[#D9D9D9] text-[#797777]',
  Normal: 'bg-[#006199]/20 text-[#006199]/70',
  Terpublikasi: 'bg-[#76C457]/30 text-[#76C457]',
  Berisiko: 'bg-[#FFD444]/50 text-[#E38621]',
  Stunting: 'bg-[#FCEBD5]/80 text-[#DD2E44]',
  'Belum Diperiksa': 'bg-[#8F8F8F]/80 text-white',
};

// ================= MAIN PAGE =================
export default function DashboardKaderPage() {
  const [balitaList, setBalitaList] = useState<BalitaLite[]>([]);
  const [resepList, setResepList] = useState<ResepLite[]>([]);
  const [totalPemeriksaan, setTotalPemeriksaan] = useState(0);
  const [aktivitas, setAktivitas] = useState<Aktivitas[]>([]);

  // ✅ Load + polling setiap 1 detik (biar auto-refresh saat ada perubahan)
  useEffect(() => {
    const refresh = () => {
      // Balita
      const savedBalita = loadJSON<BalitaLite[]>('simpasi_balita', []);
      setBalitaList(savedBalita);

      // Resep
      const savedResep = loadJSON<ResepLite[]>('simpasi_resep', []);
      setResepList(savedResep);

      // Total pemeriksaan = jumlah semua riwayat di semua balita
      const allRiwayat = loadJSON<Record<string, unknown[]>>('simpasi_riwayat', {});
      const total = Object.values(allRiwayat).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
      setTotalPemeriksaan(total);

      // Aktivitas
      setAktivitas(loadAktivitas());
    };

    refresh();

    // ✅ Polling tiap 1 detik
    const interval = setInterval(refresh, 1000);

    // ✅ Refresh juga saat tab kembali fokus
    window.addEventListener('focus', refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  // ===== Hitung stats dari data real =====
  const stats = [
    {
      label: 'Total Balita',
      value: balitaList.length,
      icon: ClipboardList,
      iconBg: 'bg-[#9E5665]/40',
      iconColor: 'text-[#9E5665]',
    },
    {
      label: 'Perlu Dipantau',
      // ✅ Cuma yang Berisiko (bukan Stunting)
      value: balitaList.filter((b) => b.kondisi === 'Berisiko' || b.kondisi === 'Stunting').length,
      icon: AlertCircle,
      iconBg: 'bg-[#FFFC8C]/60',
      iconColor: 'text-[#F1A038]',
    },
    {
      label: 'Resep Dibuat',
      // ✅ Hitung dari resepList (baca dari localStorage)
      value: resepList.length,
      icon: IconBowlSpoon,
      iconBg: 'bg-[#F88B92]/40',
      iconColor: 'text-[#DD2E44]',
    },
    {
      label: 'Pemeriksaan',
      // ✅ Hitung dari total riwayat semua balita
      value: totalPemeriksaan,
      icon: Stethoscope,
      iconBg: 'bg-[#76C0EC]/40',
      iconColor: 'text-[#006199]',
    },
  ];

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar activePage="dashboard" />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col">
        <Topbar
          title="Dashboard"
          titleColor="#D45060"
          showSearch
          searchPlaceholder="Search........"
        />

        <div className="flex-1 overflow-y-auto px-[34px] pb-8">
          {/* ============ STAT CARDS ============ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[30px] mt-[52px]">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-[17px] border border-[#D9D9D9] h-[120px] px-5 flex items-center gap-[33px]"
                >
                  <div className={`w-[56px] h-[56px] rounded-[16px] flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                    <Icon className={`w-[30px] h-[30px] ${stat.iconColor}`} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-black font-semibold text-[15px] leading-[18px]">{stat.label}</p>
                    <p className="text-black font-semibold text-[31px] leading-[36px] mt-3">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============ AKTIVITAS TERBARU ============ */}
          <div className="mt-[87px] -mx-[7px] rounded-t-[17px] overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.15)]">
            <div className="bg-[#1A7772] h-[71px] px-[27px] flex items-center">
              <h2 className="text-white font-bold text-[22px] leading-[27px]">Aktivitas Terbaru</h2>
            </div>

            <div className="bg-white">
              {aktivitas.length === 0 ? (
                <div className="h-[140px] flex items-center justify-center text-[#797777] font-medium text-[18px]">
                  Belum ada aktivitas.
                </div>
              ) : (
                aktivitas.slice(0, 5).map((item, idx) => {
                  const isRecipe = item.type === 'resep';
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-[21px] h-[70px] pl-[26px] pr-[40px] ${
                        idx !== Math.min(aktivitas.length, 5) - 1 ? 'border-b border-[#D9D9D9]' : ''
                      }`}
                    >
                      <div className={`w-[45px] h-[45px] rounded-[14px] flex items-center justify-center shrink-0 ${
                        isRecipe ? 'bg-[#F88B92]/40' : 'bg-[#76C0EC]/40'
                      }`}>
                        {isRecipe ? (
                          <IconBowlSpoon className="w-[26px] h-[26px] text-[#DD2E44]" strokeWidth={2} />
                        ) : (
                          <Stethoscope className="w-[26px] h-[26px] text-[#006199]" strokeWidth={2} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[#8F8F8F] font-semibold text-[14px] leading-[18px]">
                          {timeAgo(item.timestamp)}
                        </p>
                        <p className="text-black font-semibold text-[15px] leading-[18px] mt-[7px] truncate">
                          {item.description}
                        </p>
                      </div>

                      <span className={`shrink-0 w-[102px] h-[32px] flex items-center justify-center rounded-[6px] font-bold text-[14px] leading-[16px] ${STATUS_STYLE[item.status] || STATUS_STYLE['Draft']}`}>
                        {item.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="bg-white flex justify-end gap-[5px] pr-6 pt-px pb-[13px]">
              <button type="button" aria-label="Sebelumnya" className="w-[29px] h-[32px] rounded-[4.5px] bg-[#D9D9D9] hover:bg-[#c9c9c9] flex items-center justify-center transition-colors">
                <ChevronLeft className="w-[18px] h-[18px] text-[#8F8F8F]" strokeWidth={2.5} />
              </button>
              <button type="button" aria-label="Berikutnya" className="w-[29px] h-[32px] rounded-[4.5px] bg-white border border-black hover:bg-[#f0f0f0] flex items-center justify-center transition-colors">
                <ChevronRight className="w-[18px] h-[18px] text-black" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}