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

// ===== Ikon latar: pola grid rapi (papan catur) =====
const PATTERN_ICONS = [
  '/images/anggur.svg',
  '/images/wortel.svg',
  '/images/mangkok_buah.svg',
  '/images/banana.svg',
  '/images/mangkok_sayur.svg',
];

// Jumlah sel grid (cukup banyak supaya layar tinggi pun terisi, sisanya ter-clip)
const PATTERN_CELLS = 360;

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
          <Image
            src="/images/star_1.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 60vw, 600px"
            className="object-contain"
          />
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
          <Image
            src="/images/star_3.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 50vw, 426px"
            className="object-contain"
          />
        </div>

        {/* Background icons: grid rapi. */}
        <div className="absolute inset-0 opacity-[0.58] grid content-start grid-cols-[repeat(7,1fr)] sm:grid-cols-[repeat(11,1fr)] lg:grid-cols-[repeat(15,1fr)]">
          {Array.from({ length: PATTERN_CELLS }).map((_, i) => {
            const k = Math.floor(i / 2);
            return (
              <div
                key={i}
                className="aspect-square p-[20%] [&:nth-child(even)]:invisible"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={PATTERN_ICONS[k % PATTERN_ICONS.length]}
                  alt=""
                  className="w-full h-full object-contain"
                  style={{ transform: `rotate(${k % 2 === 0 ? -10 : 10}deg)` }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            );
          })}
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
            <Image
              src="/images/star_besar.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 700px, 962px"
              className="object-contain"
            />
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
            <Image
              src="/images/hero_images_admin.png"
              alt="Hero"
              fill
              priority
              sizes="(max-width: 1024px) 500px, 683px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* ============ LAYER KONTEN ============ */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4 lg:justify-end lg:py-8 lg:pl-8 lg:pr-[5.4vw]">
        <div className="w-full flex flex-col lg:flex-row items-center lg:justify-end gap-6 lg:gap-10">

          {/* Hero mobile */}
          <div className="lg:hidden relative flex-1 flex items-center justify-center w-full min-h-[460px] sm:min-h-[560px]">
            <div className="absolute w-[520px] h-[460px] sm:w-[680px] sm:h-[580px] -left-6 sm:-left-12 pointer-events-none z-0">
              <Image
                src="/images/star_besar.png"
                alt=""
                fill
                priority
                sizes="(max-width: 640px) 520px, 680px"
                className="object-contain"
              />
            </div>
            <div className="relative w-[340px] h-[280px] sm:w-[480px] sm:h-[390px] z-10 drop-shadow-[0px_-6.5px_25.4px_#FFFFFF]">
              <Image
                src="/images/hero_images_admin.png"
                alt="Hero"
                fill
                priority
                sizes="(max-width: 640px) 340px, 480px"
                className="object-contain"
              />
            </div>
          </div>

          {children}
        </div>
      </div>
    </main>
  );
}