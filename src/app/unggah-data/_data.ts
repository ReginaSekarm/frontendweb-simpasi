import type {
  Balita,
  Resep,
  RiwayatPemeriksaan,
  FilterResepType,
  UsiaResepType,
  KondisiType,
  StatusResepType,
  PemeriksaanForm,
  TambahResepForm,
} from './_types';

// ================= MOCK DATA =================
export const BALITA_DATA: Balita[] = [
  { id: 1, nama: 'Kentoz Albaiq', jenisKelamin: 'Laki - laki', usia: '10 bulan', tempatLahir: 'Denpasar', tanggalLahir: '01/12/2025', namaOrtu: 'Ajeng Febria', email: 'AjengFebria01@gmail.com', kondisi: 'Normal', terakhir: '12 September 2026' },
  { id: 2, nama: 'Alaia Putri', jenisKelamin: 'Perempuan', usia: '18 bulan', tempatLahir: 'Denpasar', tanggalLahir: '15/04/2024', namaOrtu: 'Siti Aminah', email: 'siti.aminah@gmail.com', kondisi: 'Berisiko', terakhir: '6 September 2026' },
  { id: 3, nama: 'Lilis Manoban', jenisKelamin: 'Perempuan', usia: '22 bulan', tempatLahir: 'Badung', tanggalLahir: '20/12/2023', namaOrtu: 'Rina Wati', email: 'rina.wati@gmail.com', kondisi: 'Berisiko', terakhir: '12 September 2026' },
];

// ✅ Resep dengan detail lengkap (bahan, langkah, nutrisi, tips)
export const RESEP_DATA: Resep[] = [
  {
    id: 1,
    nama: 'Pepaya lumat',
    usia: '6 Bulan',
    kalori: '320',
    status: 'Draft',
    image: '/images/pepaya-lumat.png',
    bahan: 'Pepaya matang 100 gr\nASIP/sufor secukupnya',
    langkah: '1. Kupas pepaya, buang bijinya\n2. Lumatkan dengan garpu hingga halus\n3. Campur dengan ASIP/sufor sampai tekstur pas\n4. Sajikan segera',
    protein: '2',
    karbohidrat: '12',
    lemak: '1',
    tips: 'Simpan di kulkas maksimal 24 jam. Hangatkan sebelum disajikan.',
  },
  {
    id: 2,
    nama: 'Telur santan pisang',
    usia: '9 - 11 Bulan',
    kalori: '320',
    status: 'Draft',
    image: '/images/telur-santan-pisang.png',
    bahan: 'Telur ayam 1 butir\nSantan kental 50 ml\nPisang ambon 1 buah\nGula secukupnya (opsional)',
    langkah: '1. Kocok telur hingga rata\n2. Campur dengan santan, aduk rata\n3. Kukus selama 15 menit\n4. Sajikan dengan irisan pisang di atasnya',
    protein: '6',
    karbohidrat: '18',
    lemak: '8',
    tips: 'Gunakan pisang yang matang untuk rasa manis alami. Bisa disimpan 1x24 jam.',
  },
  {
    id: 3,
    nama: 'Bubur Hati Ayam',
    usia: '9 - 11 Bulan',
    kalori: '320',
    status: 'Draft',
    image: '/images/bubur-hati-ayam.png',
    bahan: 'Beras 30 gr\nHati ayam 30 gr\nWortel 20 gr\nKaldu ayam 200 ml\nBawang merah 1 siung',
    langkah: '1. Cuci bersih hati ayam, rebus sebentar\n2. Cincang hati dan wortel halus\n3. Masak beras dengan kaldu hingga lembut\n4. Masukkan hati dan wortel, aduk rata\n5. Masak hingga tekstur bubur',
    protein: '8',
    karbohidrat: '22',
    lemak: '4',
    tips: 'Hati ayam kaya zat besi, bagus untuk mencegah anemia. Sajikan hangat.',
  },
  {
    id: 4,
    nama: 'Kue ubi keju',
    usia: '9 - 11 Bulan',
    kalori: '320',
    status: 'Terpublikasi',
    image: '/images/kue-ubi-keju.png',
    bahan: 'Ubi kukus 100 gr\nKeju cheddar 20 gr\nTepung beras 2 sdm\nTelur 1 butir',
    langkah: '1. Haluskan ubi kukus\n2. Campur dengan telur dan tepung\n3. Parut keju, campur ke adonan\n4. Kukus 20 menit atau panggang hingga matang',
    protein: '5',
    karbohidrat: '28',
    lemak: '7',
    tips: 'Cocok sebagai finger food untuk melatih motorik halus.',
  },
  {
    id: 5,
    nama: 'Egg potato mash',
    usia: '12+ Bulan',
    kalori: '320',
    status: 'Terpublikasi',
    image: '/images/egg-potato-mash.png',
    bahan: 'Kentang 100 gr\nTelur 1 butir\nSusu UHT 50 ml\nMentega 1 sdt',
    langkah: '1. Kukus kentang hingga lembut\n2. Haluskan kentang dengan garpu\n3. Campur dengan telur dan susu\n4. Masak di teflon dengan mentega hingga matang',
    protein: '7',
    karbohidrat: '24',
    lemak: '8',
    tips: 'Bisa disimpan di kulkas 1x24 jam. Cocok untuk sarapan.',
  },
  {
    id: 6,
    nama: 'Tahu ayam wortel',
    usia: '7 - 8 Bulan',
    kalori: '320',
    status: 'Terpublikasi',
    image: '/images/tahu-ayam-wortel.png',
    bahan: 'Tahu putih 50 gr\nAyam fillet 30 gr\nWortel 20 gr\nBawang putih 1 siung',
    langkah: '1. Haluskan tahu, ayam, dan wortel\n2. Campur dengan bawang putih cincang\n3. Bentuk bulat-bulat kecil\n4. Kukus 15 menit hingga matang',
    protein: '9',
    karbohidrat: '10',
    lemak: '5',
    tips: 'Kaya protein untuk tumbuh kembang. Bisa jadi finger food.',
  },
];

// ================= RIWAYAT PEMERIKSAAN =================
export const RIWAYAT_MAP: Record<number, RiwayatPemeriksaan[]> = {
  1: [
    { id: 1, tanggal: '12 September 2026', bb: '10.5', tb: '79', lk: '46', lila: '14.2', kondisi: 'Normal', catatan: '-', bahanMakanan: [], canEdit: true },
    { id: 2, tanggal: '12 Agustus 2026', bb: '9.8', tb: '76', lk: '45', lila: '12.6', kondisi: 'Berisiko', catatan: 'Nafsu makan menurun, perlu tambahan protein', bahanMakanan: ['Ayam', 'Telur'], diedit: 'Diedit 13 Agustus 2026, 13:40', canEdit: false },
  ],
  2: [
    { id: 1, tanggal: '6 September 2026', bb: '8.2', tb: '70', lk: '43', lila: '13.5', kondisi: 'Berisiko', catatan: 'Perlu pemantauan tinggi badan rutin', bahanMakanan: ['Ikan', 'Sayuran'], canEdit: true },
  ],
  3: [
    { id: 1, tanggal: '12 September 2026', bb: '11.2', tb: '82', lk: '47', lila: '15.2', kondisi: 'Berisiko', catatan: '-', bahanMakanan: [], canEdit: true },
  ],
};

// ================= CONSTANTS =================
export const FILTER_RESEP_OPTIONS: FilterResepType[] = ['Semua', 'Draft', 'Terpublikasi'];

export const USIA_RESEP_OPTIONS: UsiaResepType[] = ['6-8 bulan', '9-11 bulan', '12-24 bulan', '24+ bulan'];

export const KONDISI_STYLE: Record<KondisiType, string> = {
  'Belum Diperiksa': 'bg-[#8F8F8F]/80 text-white',
  Normal: 'bg-[#006199]/20 text-[#006199]/50',
  Berisiko: 'bg-[#FFD444]/50 text-[#E38621]',
  Stunting: 'bg-[#FCEBD5]/50 text-[#DD2E44]',
};

export const KONDISI_DOT: Record<KondisiType, string> = {
  'Belum Diperiksa': 'bg-[#8F8F8F]',
  Normal: 'bg-[#006199]',
  Berisiko: 'bg-[#E38621]',
  Stunting: 'bg-[#DD2E44]',
};

export const STATUS_RESEP_STYLE: Record<StatusResepType, string> = {
  Draft: 'bg-[#D9D9D9] text-[#797777]',
  Terpublikasi: 'bg-[#76C457]/30 text-[#76C457]',
};

export const EMPTY_PEMERIKSAAN: PemeriksaanForm = {
  nama: '', jenisKelamin: '', usia: '', tempatLahir: '', tanggalLahir: '',
  namaOrtu: '', email: '', bb: '', tb: '', lk: '', lila: '',
  catatan: '', bahanMakanan: [], kondisi: '', tanggalPemeriksaan: '',
};

export const EMPTY_TAMBAH_RESEP: TambahResepForm = {
  image: null, imagePreview: '', nama: '', usia: '', bahan: '', langkah: '',
  protein: '', karbohidrat: '', lemak: '', kalori: '', tips: '',
};

export const BAHAN_MAKANAN_LIST = [
  'Ayam', 'Daging', 'Ikan', 'Seafood', 'Telur',
  'Umbi - umbian', 'Sayuran', 'Buah', 'Kacang - kacangan',
];

// ================= HELPERS =================
export function mapUsiaKeForm(usia: string): UsiaResepType | '' {
  if (usia.includes('24+')) return '24+ bulan';
  if (usia.includes('12')) return '12-24 bulan';
  if (usia.includes('9') || usia.includes('11')) return '9-11 bulan';
  if (usia.includes('6') || usia.includes('7') || usia.includes('8')) return '6-8 bulan';
  return '';
}