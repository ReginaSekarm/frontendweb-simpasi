'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Check } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import PageTransition from '../../components/PageTransition';
import { api } from '../../lib/api';

interface ApiNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string | null;
  is_read: boolean | number;
  created_at: string;
}

export default function NotifikasiPage() {
  const router = useRouter();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'Semua' | 'Belum Dibaca'>('Semua');

  // Fetch Notifikasi dari Backend menggunakan helper api
  const fetchNotifications = async () => {
    try {
      const result = await api<any>('/notifications');
      if (result.success) {
        setNotifications(result.data || []);
      } else {
        setErrorMessage(result.message || 'Gagal memuat notifikasi.');
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter Data Notifikasi
  const filtered = useMemo(() => {
    if (filter === 'Belum Dibaca') {
      return notifications.filter((n) => !n.is_read);
    }
    return notifications;
  }, [notifications, filter]);

  const countUnread = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  // Handle Klik Notifikasi (PUT /notifications/:id/read)
  const handleOpenNotif = async (n: ApiNotification) => {
    if (!n.is_read) {
      try {
        await api(`/notifications/${n.id}/read`, {
          method: 'PUT',
        });
        
        // Update state lokal
        setNotifications((prev) =>
          prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x))
        );
      } catch (error) {
        console.error('Gagal menandai notifikasi dibaca:', error);
      }
    }

    // Navigasi opsional jika tipe notifikasi berkaitan dengan resep
    if (n.type === 'komentar' || n.type === 'resep') {
      router.push('/kader/resep');
    }
  };

  // Handle Tandai Semua Dibaca (PUT /notifications/read-all)
  const handleMarkAllRead = async () => {
    try {
      const result = await api<any>('/notifications/read-all', {
        method: 'PUT',
      });

      if (result.success) {
        setNotifications((prev) => prev.map((x) => ({ ...x, is_read: true })));
      }
    } catch (error) {
      console.error('Gagal menandai semua dibaca:', error);
    }
  };

  // Helper Format Waktu Sederhana
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-screen w-full bg-white flex font-['Inter',sans-serif] select-none overflow-hidden">
      <Sidebar 
        activePage="notifikasi" 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 bg-[#B3EAE8] h-full overflow-hidden flex flex-col min-w-0">
        <Topbar 
          title="Notifikasi" 
          titleColor="#D45060" 
          hideSearch 
          hideNotif 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        <PageTransition>
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-[34px] pt-6 sm:pt-8 md:pt-[32px] pb-8 w-full max-w-full">
            
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4 w-full">
              <div>
                <h1 className="font-bold text-black text-[26px] leading-tight">
                  Notifikasi
                </h1>
                <p className="text-black/60 text-[14px] mt-1">
                  Aktivitas dan pemberitahuan akun Anda
                </p>
              </div>

              {countUnread > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="h-[40px] px-[18px] rounded-[10px] bg-white border border-[#D45060] text-[#D45060] hover:bg-[#D45060]/5 font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <Check className="w-[16px] h-[16px]" strokeWidth={2.5} />
                  Tandai semua dibaca
                </button>
              )}
            </div>

            {/* FILTER TABS */}
            <div className="flex flex-wrap gap-2 sm:gap-[12px] mb-6 md:mb-[22px]">
              <FilterBtn active={filter === 'Semua'} onClick={() => setFilter('Semua')}>
                Semua ({notifications.length})
              </FilterBtn>
              <FilterBtn active={filter === 'Belum Dibaca'} onClick={() => setFilter('Belum Dibaca')}>
                Belum Dibaca ({countUnread})
              </FilterBtn>
            </div>

            {/* LIST NOTIFIKASI */}
            {isLoading ? (
              <div className="bg-white rounded-[14px] h-[180px] flex items-center justify-center">
                <p className="text-black/60 font-medium animate-pulse">Memuat notifikasi...</p>
              </div>
            ) : errorMessage ? (
              <div className="bg-white rounded-[14px] p-6 text-center text-red-600 font-medium">
                {errorMessage}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-[14px] h-[220px] flex items-center justify-center px-4 text-center">
                <p className="text-sm sm:text-[16px] text-[#797777] font-medium">
                  Tidak ada notifikasi untuk filter ini.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-[12px]">
                {filtered.map((n) => {
                  const isRead = Boolean(n.is_read);

                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleOpenNotif(n)}
                      className={`w-full text-left rounded-[14px] border ${
                        !isRead
                          ? 'border-[#D45060]/40 bg-[#F88B92]/[0.18]'
                          : 'border-[#D9D9D9] bg-white'
                      } p-4 sm:px-[22px] sm:py-[18px] hover:bg-[#F7F8F0] transition-colors cursor-pointer flex items-start gap-3 sm:gap-[16px]`}
                      style={{
                        backgroundColor: !isRead
                          ? 'color-mix(in srgb, #F88B92 18%, #FFFFFF)'
                          : '#FFFFFF',
                      }}
                    >
                      <div className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-[12px] sm:rounded-[14px] flex items-center justify-center shrink-0 bg-[#F88B92]/40">
                        <MessageCircle className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] text-[#DD2E44]" strokeWidth={2} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-[15px] leading-snug sm:leading-[20px]">
                          <span className="font-bold text-black">{n.title}</span>
                        </p>
                        <p className="text-xs sm:text-[14px] text-black/70 mt-0.5">
                          {n.message}
                        </p>
                        <p className="mt-1 sm:mt-[4px] text-xs sm:text-[13px] text-[#8F8F8F]">
                          {formatTime(n.created_at)}
                        </p>
                      </div>

                      {!isRead && (
                        <span className="shrink-0 mt-1.5 sm:mt-[18px] w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full bg-[#D45060]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  );
}

function FilterBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[38px] sm:h-[42px] px-4 sm:px-[20px] rounded-[9px] font-semibold text-sm sm:text-[15px] transition-colors cursor-pointer ${
        active ? 'bg-[#D45060] text-white' : 'bg-white text-[#797777] hover:bg-[#F7F8F0]'
      }`}
    >
      {children}
    </button>
  );
}