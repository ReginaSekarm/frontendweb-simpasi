import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-[#B3EAE8] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-[#D45060] mb-2">404 - Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-black/70 mb-4">Maaf, halaman yang kamu cari tidak tersedia.</p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-[#D45060] text-white font-semibold rounded-[8px]"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}