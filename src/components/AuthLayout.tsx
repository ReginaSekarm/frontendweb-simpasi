'use client';

import React from 'react';
import Image from 'next/image';

const FRAME_W = 1440;
const FRAME_H = 900;

/**
 * Konversi px design 1440×900 → nilai CSS yang menscale proporsional
 * terhadap viewport. Pakai min/max supaya ukuran & posisi selalu ambil
 * skala terkecil (proporsional, tidak pecah aspect ratio).
 *   positif → min(vw, vh)
 *   negatif → max(vw, vh)
 */
const s = (px: number): string => {
  const a = `${((px / FRAME_W) * 100).toFixed(2)}vw`;
  const b = `${((px / FRAME_H) * 100).toFixed(2)}vh`;
  return px >= 0 ? `min(${a},${b})` : `max(${a},${b})`;
};

type BgIcon = { src: string; alt: string; size: number; x: number; y: number };

const mk = (
  src: string,
  alt: string,
  size: number,
  pts: [number, number][]
): BgIcon[] => pts.map(([x, y]) => ({ src, alt, size, x, y }));

const BG_ICONS: BgIcon[] = [
  ...mk('/images/anggur.svg', 'anggur', 107.44, [
    [250.17, 143.56], [269.17, 790.61], [517.22, 787.44], [1341.61, 363.11],
    [1033.39, 74.94], [614.33, 74.94], [548.89, 342],
  ]),
  ...mk('/images/banana.svg', 'pisang', 92.09, [
    [448.61, 52.78], [603.78, 618.55], [1059.78, 829.67], [31.67, 801.17],
  ]),
  ...mk('/images/mangkok_sayur.svg', 'sayur', 122.79, [
    [63.33, 253.33], [866.61, 765.28], [160.44, 737.83], [-30.61, 634.39],
  ]),
  ...mk('/images/wortel.svg', 'wortel', 76.74, [
    [83.39, 90.78], [121.39, 650.22], [577.39, 206.89], [1248.72, 25.33],
    [504.55, 629.11], [1276.17, 822.28], [699.83, 811.72],
  ]),
  ...mk('/images/mangkok_buah.svg', 'buah', 122.79, [
    [374.72, 239.61], [380, 681.89], [199.5, 6.33], [824.39, 14.78],
  ]),

  // ===== Ikon pengisi celah antara hero & card =====
  // Cuma pisang, digeser lagi ke kanan
  ...mk('/images/banana.svg', 'pisang', 78, [
    [820, 350], [880, 560],
  ]),

  // ===== Anggur di sebelah kanan form (card) =====
  ...mk('/images/anggur.svg', 'anggur', 95, [
    [1385, 480],
  ]),
];

type AuthLayoutProps = { children: React.ReactNode };

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen w-full bg-[#B3EAE8] select-none font-['Inter',sans-serif]">

      {/* ============ LAYER DEKORATIF ============ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* Star pojok kiri atas */}
        <div
          className="absolute z-[1]"
          style={{
            top: s(-50),
            left: s(-200),
            width: s(600),
            height: s(200),
          }}
        >
          <Image src="/images/star_1.png" alt="" fill priority className="object-contain" />
        </div>

        {/* Star pojok kanan bawah */}
        <div
          className="absolute z-[1]"
          style={{
            bottom: s(-168),
            right: s(-58),
            width: s(426),
            height: s(426),
          }}
        >
          <Image src="/images/star_3.png" alt="" fill priority className="object-contain" />
        </div>

        {/* Background icons */}
        <div className="absolute inset-0 opacity-[0.58]">
          {BG_ICONS.map((ic, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: s(ic.x),
                top: s(ic.y),
                width: s(ic.size),
                height: s(ic.size),
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ic.src}
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>

        {/* Hero khusus lg */}
        <div className="hidden lg:block absolute inset-0">
          <div
            className="absolute z-0"
            style={{
              width: s(962),
              height: s(732),
              left: s(-171),
              top: s(100),
            }}
          >
            <Image src="/images/star_besar.png" alt="" fill priority className="object-contain" />
          </div>

          <div
            className="absolute z-10 drop-shadow-[0px_-6.5px_25.4px_#FFFFFF]"
            style={{
              width: s(683),
              height: s(516),
              left: s(-19),
              top: s(225),
            }}
          >
            <Image src="/images/hero_images_admin.png" alt="" fill priority className="object-contain" />
          </div>
        </div>
      </div>

      {/* ============ LAYER KONTEN ============ */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 lg:justify-end lg:py-8 lg:pl-8 lg:pr-[5.4vw]">
        <div className="w-full flex flex-col lg:flex-row items-center lg:justify-end gap-6 lg:gap-10">

          {/* Hero mobile */}
          <div className="lg:hidden relative flex-1 flex items-center justify-center w-full min-h-[460px] sm:min-h-[560px]">
            <div className="absolute w-[520px] h-[460px] sm:w-[680px] sm:h-[580px] -left-6 sm:-left-12 pointer-events-none z-0">
              <Image src="/images/star_besar.png" alt="" fill priority className="object-contain" />
            </div>
            <div className="relative w-[340px] h-[280px] sm:w-[480px] sm:h-[390px] z-10 drop-shadow-[0px_-6.5px_25.4px_#FFFFFF]">
              <Image src="/images/hero_images_admin.png" alt="" fill priority className="object-contain" />
            </div>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}