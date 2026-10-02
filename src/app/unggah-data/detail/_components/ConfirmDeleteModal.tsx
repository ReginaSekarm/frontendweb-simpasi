'use client';

type Props = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ onClose, onConfirm }: Props) {
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[694px] bg-white rounded-[15px] shadow-2xl px-[35px] pt-[78px] pb-[70px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-[36px] font-semibold text-black leading-[44px]">
          Hapus Data Pemeriksaan Ini?
        </h2>
        <p className="mt-[16px] text-center text-[24px] font-normal text-black leading-[29px] max-w-[640px] mx-auto">
        Data pemeriksaan akan dihapus permanen dari riwayat tumbuh kembang anak dan tidak bisa dikembalikan. 
        Pastikan ini bukan pemeriksaan yang sudah dilihat orang tua.</p>

        <div className="mt-[58px] flex items-center justify-between gap-[53px]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[53px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[15px] text-[#797777]/80 font-semibold text-[27px] leading-[33px] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-[53px] bg-[#FF0020] hover:bg-[#e6001c] rounded-[15px] text-white font-semibold text-[27px] leading-[33px] transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}