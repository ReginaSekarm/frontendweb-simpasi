'use client';

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ onClose, onConfirm }: Props) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onClose}
    >
      {/* Modal pakai flexbox — auto layout, bukan absolute */}
      <div
        className="relative w-full max-w-[480px] bg-white rounded-[14px] sm:rounded-[16px] shadow-2xl px-5 sm:px-8 pt-7 sm:pt-9 pb-6 sm:pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul */}
        <h2 className="text-center text-black font-bold text-[18px] sm:text-[22px] leading-[1.25] sm:leading-[1.2]">
          Hapus Resep Ini?
        </h2>

        {/* Deskripsi */}
        <p className="mt-3 sm:mt-4 text-center text-black text-[13px] sm:text-[15px] leading-[1.5] font-normal max-w-[420px] mx-auto">
          Resep akan dihapus permanen dari daftar dan tidak bisa dikembalikan.
          Pastikan resep ini memang sudah tidak diperlukan.
        </p>

        {/* Tombol — pakai flexbox supaya rapi di semua ukuran */}
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 h-[44px] sm:h-[46px] bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[10px] text-[#797777]/90 font-semibold text-[14px] sm:text-[15px] transition-all duration-150 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:flex-1 h-[44px] sm:h-[46px] bg-[#FF0020] hover:bg-[#e0001c] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#FF0020]/50 focus-visible:outline-none rounded-[10px] text-white font-semibold text-[14px] sm:text-[15px] transition-all duration-150 cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}