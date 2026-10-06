'use client';

type Props = {
  onClose: () => void;
};

export default function ProfilToast({ onClose }: Props) {
  return (
    <div
      className="fixed top-[40px] right-[40px] z-[10000] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
      style={{ width: '578.37px', height: '153.79px' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: '572.36px',
          height: '153.79px',
          background: '#2E9C52',
          borderRadius: '20.0592px',
        }}
      />

      <div
        className="absolute"
        style={{
          left: '10.03px',
          top: 0,
          width: '562.33px',
          height: '153.79px',
          background: '#FFFFFF',
          borderRadius: '20.0592px',
        }}
      />

      <svg
        className="absolute"
        style={{ left: '30.76px', top: '28.08px', width: '44.49px', height: '44.49px' }}
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

      <h3
        className="absolute font-bold text-black"
        style={{ left: '90.27px', top: '29.42px', fontSize: '21.3965px', lineHeight: '26px' }}
      >
        Profil Berhasil Disimpan
      </h3>

      <p
        className="absolute"
        style={{
          left: '90.27px',
          top: '62.18px',
          width: '488.11px',
          fontSize: '21.3965px',
          lineHeight: '26px',
          color: 'rgba(0, 0, 0, 0.71)',
        }}
      >
        Profil disimpan sebagai. Anda bisa lanjutkan mengedit kapan saja dari Pengaturan.
      </p>
    </div>
  );
}