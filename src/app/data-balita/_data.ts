import type {
  Balita,
  BalitaForm,
  PemeriksaanForm,
  KondisiType,
  FilterType,
} from './_types';

// ================= MOCK DATA =================
export const BALITA_DATA: Balita[] = [
  {
    id: 1,
    nama: 'Kentoz Albaiq',
    jenisKelamin: 'Laki - laki',
    usia: '10 bulan',
    tempatLahir: 'Denpasar',
    tanggalLahir: '01/12/2025',
    namaOrtu: 'Ajeng Febria',
    email: 'AjengFebria01@gmail.com',
    kondisi: 'Belum Diperiksa',
    bb: '', tb: '', lk: '', lila: '',
  },
  {
    id: 2,
    nama: 'Alaia Putri',
    jenisKelamin: 'Perempuan',
    usia: '18 bulan',
    tempatLahir: 'Denpasar',
    tanggalLahir: '15/04/2024',
    namaOrtu: 'Siti Aminah',
    email: 'siti.aminah@gmail.com',
    kondisi: 'Stunting',
    bb: '6.4', tb: '63.3', lk: '40.9', lila: '14.75',
  },
  {
    id: 3,
    nama: 'Lilis Manoban',
    jenisKelamin: 'Perempuan',
    usia: '22 bulan',
    tempatLahir: 'Badung',
    tanggalLahir: '20/12/2023',
    namaOrtu: 'Rina Wati',
    email: 'rina.wati@gmail.com',
    kondisi: 'Berisiko',
    bb: '10.2', tb: '82.1', lk: '46.5', lila: '15.2',
  },
  {
    id: 4,
    nama: 'Windah Basmallah',
    jenisKelamin: 'Laki - laki',
    usia: '15 bulan',
    tempatLahir: 'Gianyar',
    tanggalLahir: '10/07/2024',
    namaOrtu: 'Giselle',
    email: 'giselle@gmail.com',
    kondisi: 'Normal',
    bb: '9.8', tb: '76.4', lk: '45.8', lila: '14.1',
  },
];

// ================= CONSTANTS =================
export const FILTER_OPTIONS: FilterType[] = ['Semua', 'Belum Diperiksa', 'Stunting', 'Berisiko', 'Normal'];

export const KONDISI_STYLE: Record<KondisiType, string> = {
  'Belum Diperiksa': 'bg-[#8F8F8F]/80 text-white',
  Normal: 'bg-[#006199]/20 text-[#006199]/70',
  Berisiko: 'bg-[#FFD444]/50 text-[#E38621]',
  Stunting: 'bg-[#FCEBD5]/80 text-[#DD2E44]',
};

export const EMPTY_FORM: BalitaForm = {
  nama: '',
  jenisKelamin: '',
  usia: '',
  tempatLahir: '',
  tanggalLahir: '',
  namaOrtu: '',
  email: '',
  bb: '', tb: '', lk: '', lila: '',
  kondisi: '',
};

export const EMPTY_PEMERIKSAAN: PemeriksaanForm = {
  bb: '', tb: '', lk: '', lila: '', catatan: '', bahanMakanan: [], kondisi: 'Normal', tanggalPemeriksaan: '',
};

export const BAHAN_MAKANAN_LIST = [
  'Ayam', 'Daging', 'Ikan', 'Seafood', 'Telur',
  'Umbi - umbian', 'Sayuran', 'Buah', 'Kacang - kacangan',
];