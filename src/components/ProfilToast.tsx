'use client';

type Props = {
  onClose: () => void;
};

export default function ProfilToast({ onClose }: Props) {
  return (
    // 👇 Ukuran container, posisi, dan shadow disesuaikan
    <div
      className="fixed top-[24px] right-[24px] z-[10000] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{ width: '380px', height: '100px' }}
      role="status"
      aria-live="polite"
    >
      {/* 👇 Background hijau (aksen kiri) diperkecil */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '375px',
          height: '100px',
          background: '#2E9C52',
          borderRadius: '12px',
        }}
      />

      {/* 👇 Background putih diperkecil */}
      <div
        className="absolute"
        style={{
          left: '6px',
          top: 0,
          width: '369px',
          height: '100px',
          background: '#FFFFFF',
          borderRadius: '12px',
        }}
      />

      {/* 👇 Ikon centang diperkecil dari 44px menjadi 28px */}
      <svg
        className="absolute"
        style={{ left: '20px', top: '18px', width: '28px', height: '28px' }}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="12" fill="#2E9C52" />
        <path
          d="M6.8 12.5L10.4 16.1L17.2 9.3"
          stroke="#FFFFFF"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* 👇 Judul diperkecil dari 21.4px menjadi 14px */}
      <h3
        className="absolute font-bold text-black"
        style={{ left: '58px', top: '19px', fontSize: '14px', lineHeight: '17px' }}
      >
        Profil Berhasil Disimpan
      </h3>

      {/* 👇 Deskripsi diperkecil dari 21.4px menjadi 12px */}
      <p
        className="absolute"
        style={{
          left: '58px',
          top: '40px',
          width: '305px',
          fontSize: '12px',
          lineHeight: '15px',
          color: 'rgba(0, 0, 0, 0.71)',
        }}
      >
        Profil disimpan sebagai. Anda bisa lanjutkan mengedit kapan saja dari Pengaturan.
      </p>
    </div>
  );
}