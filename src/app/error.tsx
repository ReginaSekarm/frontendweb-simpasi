'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="h-screen w-full bg-[#B3EAE8] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold text-[#D45060] mb-2">Terjadi Kesalahan</h2>
      <p className="text-sm text-black/70 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[#D45060] text-white font-semibold rounded-[8px] cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>
  );
}