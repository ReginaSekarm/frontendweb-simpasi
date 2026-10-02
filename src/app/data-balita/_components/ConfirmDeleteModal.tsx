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
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div
        className="relative w-full max-w-[720px] bg-white rounded-[24px] shadow-2xl px-[60px] pt-[60px] pb-[52px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-black font-bold text-[40px] leading-[1.15]">{title}</h2>
        <p className="mt-[28px] text-center text-black text-[26px] leading-[1.35] font-normal">{description}</p>

        <div className="mt-[44px] flex items-center justify-center gap-[44px]">
          <button
            type="button"
            onClick={onCancel}
            className="min-w-[280px] h-[76px] px-[44px] bg-[#D9D9D9] hover:bg-[#c9c9c9] rounded-[14px] text-[#8F8F8F] font-bold text-[30px] transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-w-[280px] h-[76px] px-[44px] bg-[#FF0033] hover:bg-[#e0002c] rounded-[14px] text-white font-bold text-[30px] transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}