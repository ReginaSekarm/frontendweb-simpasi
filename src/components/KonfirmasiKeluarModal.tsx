'use client';

type Props = {
  onTetap: () => void;
  onKeluar: () => void;
};

export default function KonfirmasiKeluarModal({ onTetap, onKeluar }: Props) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onTetap}
    >
      <div
        className="relative w-full max-w-[420px] bg-white rounded-[14px] sm:rounded-[16px] shadow-2xl px-5 sm:px-7 pt-7 sm:pt-8 pb-6 sm:pb-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul */}
        <h2 className="text-center text-black font-bold text-[18px] sm:text-[20px] leading-[1.25]">
          Keluar dari Akun?
        </h2>

        {/* Deskripsi */}
        <p className="mt-3 text-center text-black/80 text-[13px] sm:text-[14px] leading-[1.5]">
          Anda akan keluar dari akun ini. Yakin ingin melanjutkan?
        </p>

        {/* Tombol pakai flexbox — horizontal, sejajar, lebar sama */}
        <div className="mt-6 sm:mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onTetap}
            className="flex-1 h-[42px] sm:h-[44px] bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[10px] text-[#797777]/90 font-semibold text-[14px] transition-all duration-150 cursor-pointer"
          >
            Tetap di sini
          </button>
          <button
            type="button"
            onClick={onKeluar}
            className="flex-1 h-[42px] sm:h-[44px] bg-[#FF0020] hover:bg-[#e0001c] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#FF0020]/50 focus-visible:outline-none rounded-[10px] text-white font-semibold text-[14px] transition-all duration-150 cursor-pointer"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}