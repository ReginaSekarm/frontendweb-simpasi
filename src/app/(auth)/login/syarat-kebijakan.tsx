export type LegalSection = { title: string; body: string };

export const SYARAT_KETENTUAN: LegalSection[] = [
  {
    title: '1. Ketentuan Umum',
    body: 'Akun ini digunakan sebagai kader Posyandu resmi yang telah ditunjuk dan terdaftar di wilayah kerja saya.',
  },
  {
    title: '2. Penggunaan Data',
    body: 'Saya akan mengakses data pribadi & kesehatan balita, termasuk BB, TB, LK, LiLA, dan catatan kesehatan lainnya.',
  },
  {
    title: '3. Kerahasiaan Data',
    body: 'Tidak membagikan atau menyalahgunakan data balita/orang tua kepada pihak yang tidak berwenang.',
  },
  {
    title: '4. Akurasi Data',
    body: 'Bertanggung jawab menginput data pemeriksaan secara akurat sesuai hasil pengukuran langsung.',
  },
  {
    title: '5. Batas Kewenangan',
    body: 'Perubahan data pemeriksaan hanya berlaku 24 jam setelahnya perlu persetujuan Admin/Bidan.',
  },
];

export const KEBIJAKAN_PRIVASI_INTRO =
  'Kebijakan ini menjelaskan bagaimana SiMPASI mengelola data Anda sebagai kader Posyandu.';

export const KEBIJAKAN_PRIVASI: LegalSection[] = [
  {
    title: '1. Data yang Dikumpulkan',
    body: 'Data akun Anda (nama, email, no. HP, wilayah posyandu) dan data pemeriksaan balita yang Anda input (BB, TB, LK, LiLA, status gizi, catatan kesehatan).',
  },
  {
    title: '2. Penggunaan Data',
    body: 'Untuk pemantauan tumbuh kembang balita, pemberian rekomendasi gizi, dan pelaporan program pencegahan stunting.',
  },
  {
    title: '3. Pembagian Data',
    body: 'Data dibagikan hanya kepada Admin, Bidan, dan puskesmas/dinas kesehatan setempat untuk keperluan pelaporan. Kami tidak menjual data kepada pihak ketiga.',
  },
  {
    title: '4. Kerahasiaan Data Balita',
    body: 'Data balita bersifat sensitif. Anda hanya boleh mengakses data balita di wilayah kerja Anda dan dilarang membagikannya kepada pihak yang tidak berwenang.',
  },
  {
    title: '5. Keamanan & Jejak Aktivitas',
    body: 'Data disimpan dengan akses terbatas. Setiap penambahan atau perubahan data pemeriksaan dicatat (siapa dan kapan) sebagai jejak audit.',
  },
  {
    title: '6. Hak Anda',
    body: 'Anda dapat melihat dan meminta koreksi atas data akun Anda melalui Admin.',
  },
  {
    title: '7. Perubahan Kebijakan',
    body: 'Kebijakan ini dapat diperbarui sewaktu-waktu dan perubahan penting akan diinformasikan melalui aplikasi.',
  },
];