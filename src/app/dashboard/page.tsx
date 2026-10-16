'use client';

import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';

// ================= ICON CUSTOM (SVG) =================
const IconUserExclamation = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.5 12a5 5 0 1 0 0-10a5 5 0 0 0 0 10m10-5.5v5H19v-5zm.25 7.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-2.39 5.416A2 2 0 0 1 16.446 22h-11.9a2 2 0 0 1-1.913-2.584l.78-2.556A4.725 4.725 0 0 1 7.96 13.5h5.075c2.105 0 3.93 1.35 4.545 3.36z"
    />
  </svg>
);

// bowl-with-spoon - "Resep Dibuat" & aktivitas resep
const IconBowlSpoon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="m26.393 3.05l-1.649 2.807a8.43 8.43 0 0 1 5.236 7.804v4.9c0 6.342-5.138 11.48-11.48 11.48h-5.02C7.138 30.041 2 24.903 2 18.561v-4.9c0-4.652 3.778-8.43 8.43-8.43h11.12q.226 0 .448.012L24.1 1.665a1.333 1.333 0 0 1 1.865-.442c.618.393.792 1.207.428 1.826M10.387 7.87a5.793 5.793 0 0 0-5.777 5.79a5.8 5.8 0 0 0 5.704 5.79q.227-.631.584-1.242c1.048-1.784 2.68-2.925 4.267-3.163a2.42 2.42 0 0 0 1.757-1.158l3.533-6.017zm8.685 9.477c.24.632.343 1.35.303 2.103h2.345a5.8 5.8 0 0 0 5.79-5.79c0-2.601-1.729-4.81-4.097-5.537l-4.181 7.12a2.43 2.43 0 0 0-.16 2.104M18.5 28.04a9.477 9.477 0 0 0 9.48-9.48v-1.177a7.43 7.43 0 0 1-6.43 3.707H10.43A7.43 7.43 0 0 1 4 17.384v1.177a9.477 9.477 0 0 0 9.48 9.48zm-.295-8.59c0-1.179-.476-2.217-1.383-2.75c-1.555-.913-3.792.006-4.994 2.054a6 6 0 0 0-.348.696z"
    />
  </svg>
);

// clipboard-list - "Total Balita"
const ClipboardList = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" fill="none" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128v320c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64h-37.5C269.4 26.7 233.8 0 192 0m0 64a32 32 0 1 1 0 64a32 32 0 1 1 0-64M72 272a24 24 0 1 1 48 0a24 24 0 1 1-48 0m104-16h128c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16M72 368a24 24 0 1 1 48 0a24 24 0 1 1-48 0m88 0c0-8.8 7.2-16 16-16h128c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16"
    />
  </svg>
);

// ================= TYPES =================
type StatusType = 'Draft' | 'Normal' | 'Terpublikasi' | 'Berisiko' | 'Stunting';

type Activity = {
  id: number;
  time: string;
  description: string;
  status: StatusType;
  type: 'resep' | 'pemeriksaan';
};

// ================= DUMMY DATA =================
const STATS = [
  { label: 'Total Balita', value: 5, icon: ClipboardList, iconBg: 'bg-[#9E5665]/40', iconColor: 'text-[#9E5665]' },
  { label: 'Perlu Dipantau', value: 2, icon: IconUserExclamation, iconBg: 'bg-[#FFFC8C]/60', iconColor: 'text-[#F1A038]' },
  { label: 'Resep Dibuat', value: 16, icon: IconBowlSpoon, iconBg: 'bg-[#F88B92]/40', iconColor: 'text-[#DD2E44]' },
  { label: 'Pemeriksaan', value: 10, icon: Stethoscope, iconBg: 'bg-[#76C0EC]/40', iconColor: 'text-[#006199]' },
];

// Aktivitas
const ACTIVITIES: Activity[] = [
  { id: 1, time: '2 menit lalu', description: 'Menambahkan resep "Bubur Udang Wortel"', status: 'Draft', type: 'resep' },
  { id: 2, time: '20 menit lalu', description: 'Memeriksa "Kentoz Albaiq" (10 bulan)', status: 'Normal', type: 'pemeriksaan' },
  { id: 3, time: '35 menit lalu', description: 'Menambahkan resep "Kue Ubi Keju"', status: 'Terpublikasi', type: 'resep' },
  { id: 4, time: '55 menit lalu', description: 'Memeriksa "Alia Putri" (18 bulan)', status: 'Berisiko', type: 'pemeriksaan' },
  { id: 5, time: '5 jam lalu', description: 'Memeriksa "Lilis Manoban" (22 bulan)', status: 'Stunting', type: 'pemeriksaan' },
  { id: 6, time: '6 jam lalu', description: 'Menambahkan resep "Nasi Tim Ayam Sayur"', status: 'Draft', type: 'resep' },
  { id: 7, time: '8 jam lalu', description: 'Memeriksa "Budi Santoso" (15 bulan)', status: 'Normal', type: 'pemeriksaan' },
  { id: 8, time: '10 jam lalu', description: 'Menambahkan resep "Puding Alpukat"', status: 'Terpublikasi', type: 'resep' },
  { id: 9, time: '12 jam lalu', description: 'Memeriksa "Sinta Dewi" (20 bulan)', status: 'Berisiko', type: 'pemeriksaan' },
  { id: 10, time: '1 hari lalu', description: 'Menambahkan resep "Sup Ikan Salmon"', status: 'Terpublikasi', type: 'resep' },
  { id: 11, time: '1 hari lalu', description: 'Memeriksa "Rizki Pratama" (9 bulan)', status: 'Normal', type: 'pemeriksaan' },
  { id: 12, time: '1 hari lalu', description: 'Menambahkan resep "Bubur Kacang Hijau"', status: 'Draft', type: 'resep' },
  { id: 13, time: '2 hari lalu', description: 'Memeriksa "Ayu Lestari" (14 bulan)', status: 'Stunting', type: 'pemeriksaan' },
  { id: 14, time: '2 hari lalu', description: 'Menambahkan resep "Bola-Bola Nasi"', status: 'Terpublikasi', type: 'resep' },
  { id: 15, time: '2 hari lalu', description: 'Memeriksa "Dian Puspita" (16 bulan)', status: 'Normal', type: 'pemeriksaan' },
  { id: 16, time: '3 hari lalu', description: 'Menambahkan resep "Tahu Kukus Brokoli"', status: 'Draft', type: 'resep' },
  { id: 17, time: '3 hari lalu', description: 'Memeriksa "Eka Wijaya" (11 bulan)', status: 'Berisiko', type: 'pemeriksaan' },
  { id: 18, time: '3 hari lalu', description: 'Menambahkan resep "Puree Kentang Ayam"', status: 'Terpublikasi', type: 'resep' },
  { id: 19, time: '4 hari lalu', description: 'Memeriksa "Fahri Ramadhan" (13 bulan)', status: 'Normal', type: 'pemeriksaan' },
  { id: 20, time: '4 hari lalu', description: 'Menambahkan resep "Bubur Jagung Manis"', status: 'Draft', type: 'resep' },
];

const ITEMS_PER_PAGE = 5;

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // State pencarian (dikirim ke Topbar)
  const [searchQuery, setSearchQuery] = useState('');

  // Cek apakah ada aktivitas (data asli, tanpa filter)
  const hasActivities = ACTIVITIES.length > 0;

  // Filter aktivitas berdasarkan pencarian (deskripsi, status, waktu)
  const keyword = searchQuery.trim().toLowerCase();
  const filteredActivities = keyword
    ? ACTIVITIES.filter(
        (a) =>
          a.description.toLowerCase().includes(keyword) ||
          a.status.toLowerCase().includes(keyword) ||
          a.time.toLowerCase().includes(keyword)
      )
    : ACTIVITIES;

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE));

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Kembali ke halaman 1 setiap kali pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar
        activePage="dashboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar
          title="Dashboard"
          titleColor="#D45060"
          showSearch
          searchPlaceholder="Search........"
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 pt-4 sm:pt-5 lg:pt-6 pb-4 sm:pb-5 lg:pb-6">

          {/* ============ STAT CARDS ============ */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-5">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-[12px] sm:rounded-[14px] border border-[#D9D9D9] min-h-[80px] sm:min-h-[90px] lg:h-[100px] px-3 sm:px-4 py-3 flex items-center gap-3 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] lg:w-[48px] lg:h-[48px] rounded-[10px] lg:rounded-[12px] flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                    <Icon className={`w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] ${stat.iconColor}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-black font-semibold text-[10px] sm:text-[11px] lg:text-[13px] leading-[12px] sm:leading-[14px] lg:leading-[16px] truncate">
                      {stat.label}
                    </p>
                    <p className="text-black font-semibold text-[20px] sm:text-[22px] lg:text-[26px] leading-[24px] sm:leading-[26px] lg:leading-[30px] mt-0.5 lg:mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ============ AKTIVITAS TERBARU ============ */}
          <div className="mt-5 sm:mt-7 lg:mt-9 rounded-t-[12px] lg:rounded-t-[14px] overflow-hidden shadow-[0_4px_4px_rgba(0,0,0,0.15)]">

            {/* Header */}
            <div className="bg-[#1A7772] h-[44px] sm:h-[52px] lg:h-[60px] px-4 lg:px-6 flex items-center justify-between">
              <h2 className="text-white font-bold text-[14px] sm:text-[16px] lg:text-[18px] leading-[18px] lg:leading-[22px]">
                Aktivitas Terbaru
              </h2>
              {/* Info halaman — hanya muncul kalau ada data */}
              {hasActivities && (
                <span className="text-white/80 text-[10px] sm:text-[11px] lg:text-[12px] font-semibold">
                  Hal. {currentPage} dari {totalPages} • {filteredActivities.length} data
                </span>
              )}
            </div>

            {/* KONDISI 1: EMPTY STATE (Belum Ada Aktivitas) */}
            {!hasActivities ? (
              <div className="bg-white py-10 sm:py-14 lg:py-16 px-4 flex flex-col items-center justify-center">
                {/* Icon bulat peach */}
                <div className="w-[90px] h-[90px] sm:w-[80px] sm:h-[80px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#FCEBD5] flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                  {/* Icon file + clock */}
                  <svg
                    className="w-[35px] h-[35px] sm:w-[35px] sm:h-[35px] lg:w-[35px] lg:h-[35px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ color: '#D45060' }}
                    aria-hidden="true"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                    >
                      <path d="M11.25 17.25a6 6 0 1 0 12 0a6 6 0 0 0-12 0" />
                      <path d="M19.902 17.25H17.25v-2.652M3.75 6.75h10.5m-10.5 4.5h6m-6 4.5H7.5m0 4.5H2.25a1.5 1.5 0 0 1-1.5-1.5V2.25a1.5 1.5 0 0 1 1.5-1.5h10.629a1.5 1.5 0 0 1 1.06.439l2.872 2.872a1.5 1.5 0 0 1 .439 1.06V7.5" />
                    </g>
                  </svg>
                </div>

                {/* Judul */}
                <h3 className="text-black font-semibold text-[18px] sm:text-[20px] lg:text-[24px] leading-[24px] sm:leading-[28px] lg:leading-[32px] text-center mb-2 sm:mb-3">
                  Belum Ada Aktivitas
                </h3>

                {/* Deskripsi */}
                <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
                  Aktivitas seperti pemeriksaan balita dan resep MPASI yang Anda buat akan muncul di sini.
                </p>
              </div>
            ) : filteredActivities.length === 0 ? (
              /* KONDISI 2: HASIL PENCARIAN KOSONG */
              <div className="bg-white py-10 sm:py-14 lg:py-16 px-4 flex flex-col items-center justify-center">
                <h3 className="text-black font-semibold text-[16px] sm:text-[18px] lg:text-[20px] leading-[22px] sm:leading-[26px] text-center mb-2">
                  Aktivitas Tidak Ditemukan
                </h3>
                <p className="text-black/80 font-normal text-[12px] sm:text-[13px] lg:text-[15px] leading-[18px] sm:leading-[20px] lg:leading-[22px] text-center max-w-[320px] sm:max-w-[380px] lg:max-w-[440px] break-words">
                  Tidak ada aktivitas yang cocok dengan &quot;{searchQuery}&quot;.
                </p>
              </div>
            ) : (
              <>
                {/* KONDISI 3: LIST AKTIVITAS */}
                <div className="bg-white relative overflow-hidden">
                  <div
                    key={currentPage}
                    className={`${
                      slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                    }`}
                  >
                    {paginatedActivities.map((item, idx) => {
                      const isRecipe = item.type === 'resep';
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-2.5 sm:gap-3 lg:gap-4 min-h-[56px] sm:min-h-[60px] px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 hover:bg-[#F7F8F0] transition-colors ${
                            idx !== paginatedActivities.length - 1 ? 'border-b border-[#D9D9D9]' : ''
                          }`}
                        >
                          <div className={`w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] lg:w-[40px] lg:h-[40px] rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] flex items-center justify-center shrink-0 ${
                            isRecipe ? 'bg-[#F88B92]/40' : 'bg-[#76C0EC]/40'
                          }`}>
                            {isRecipe ? (
                              <IconBowlSpoon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[22px] lg:h-[22px] text-[#DD2E44]" strokeWidth={2} />
                            ) : (
                              <Stethoscope className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] lg:w-[22px] lg:h-[22px] text-[#006199]" strokeWidth={2} />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-[#8F8F8F] font-semibold text-[10px] sm:text-[11px] lg:text-[12px] leading-[12px] lg:leading-[15px]">
                              {item.time}
                            </p>
                            <p className="text-black font-semibold text-[11px] sm:text-[12px] lg:text-[13px] leading-[14px] lg:leading-[16px] mt-0.5 truncate">
                              {item.description}
                            </p>
                          </div>

                          <span className={`shrink-0 min-w-[60px] sm:min-w-[72px] lg:min-w-[90px] h-[22px] sm:h-[24px] lg:h-[28px] px-1.5 sm:px-2 flex items-center justify-center rounded-[5px] lg:rounded-[6px] font-bold text-[9px] sm:text-[10px] lg:text-[12px] leading-[11px] lg:leading-[14px] ${STATUS_STYLE[item.status] || STATUS_STYLE['Draft']}`}>
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* KONDISI 4: PAGINATION — hanya muncul kalau ada data */}
                <div className="bg-white flex items-center justify-between gap-2 px-4 lg:px-6 pt-2 pb-3 lg:pb-4">
                  <span className="lg:hidden text-[10px] text-[#8F8F8F] font-semibold">
                    Hal. {currentPage} dari {totalPages}
                  </span>

                  <div className="flex justify-end gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={currentPage === 1}
                      aria-label="Aktivitas sebelumnya"
                      className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[6px] flex items-center justify-center transition-all ${
                        currentPage === 1
                          ? 'bg-[#F0F0F0] border border-[#F0F0F0] cursor-not-allowed'
                          : 'bg-white border-2 border-black hover:bg-[#2E9C52]/10 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft
                        className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] ${
                          currentPage === 1 ? 'text-[#B0B0B0]' : 'text-black'
                        }`}
                        strokeWidth={2.5}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={currentPage === totalPages}
                      aria-label="Aktivitas berikutnya"
                      className={`w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] rounded-[6px] flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? 'bg-[#F0F0F0] border border-[#F0F0F0] cursor-not-allowed'
                          : 'bg-white border-2 border-black hover:bg-[#2E9C52]/10 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <ChevronRight
                        className={`w-[14px] h-[14px] sm:w-[16px] sm:h-[16px] ${
                          currentPage === totalPages ? 'text-[#B0B0B0]' : 'text-black'
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
    </div>
  );
}