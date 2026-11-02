'use client';

type Props = {
  type: 'balita' | 'pemeriksaan';
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({ type, onCancel, onConfirm }: Props) {
  const isPemeriksaan = type === 'pemeriksaan';
  const title = isPemeriksaan ? 'Hapus Data Pemeriksaan Ini?' : 'Hapus Data Balita Ini?';
  const description = isPemeriksaan
    ? 'Data pemeriksaan akan dihapus permanen dari riwayat tumbuh kembang anak dan tidak bisa dikembalikan. Pastikan ini bukan pemeriksaan yang sudah dilihat orang tua.'
    : 'Data balita akan dihapus permanen dari sistem dan tidak bisa dikembalikan. Pastikan data ini memang sudah tidak diperlukan.';

  return (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-3 sm:p-4"
      onClick={onCancel}
    >
      {/*  Modal responsive: padding & max-width menyesuaikan layar */}
      <div
        className="relative w-full max-w-[520px] bg-white rounded-[14px] sm:rounded-[16px] shadow-2xl px-5 sm:px-[40px] pt-7 sm:pt-[40px] pb-6 sm:pb-[36px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Judul responsive */}
        <h2 className="text-center text-black font-bold text-[18px] sm:text-[24px] leading-[1.25] sm:leading-[1.2]">
          {title}
        </h2>

        {/* Deskripsi responsive */}
        <p className="mt-3 sm:mt-[16px] text-center text-black text-[13px] sm:text-[15px] leading-[1.5] sm:leading-[1.4] font-normal">
          {description}
        </p>

        {/*  Tombol: stack vertikal di mobile, horizontal di desktop */}
        <div className="mt-6 sm:mt-[32px] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-[24px]">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:min-w-[160px] h-[44px] sm:h-[48px] sm:px-[30px] bg-[#D9D9D9] hover:bg-[#c9c9c9] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#8F8F8F]/50 focus-visible:outline-none rounded-[10px] text-[#8F8F8F] font-bold text-[14px] sm:text-[16px] transition-all duration-150 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:min-w-[160px] h-[44px] sm:h-[48px] sm:px-[30px] bg-[#FF0033] hover:bg-[#e0002c] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-[#FF0033]/50 focus-visible:outline-none rounded-[10px] text-white font-bold text-[14px] sm:text-[16px] transition-all duration-150 cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}