export type KondisiType = 'Belum Diperiksa' | 'Normal' | 'Berisiko' | 'Stunting';
export type KondisiFormType = '' | 'Normal' | 'Berisiko' | 'Stunting';
export type JenisKelaminFormType = '' | 'Laki - laki' | 'Perempuan';

export type StatusResepType = 'Draft' | 'Terpublikasi';
export type FilterResepType = 'Semua' | StatusResepType;

export type Resep = {
  id: number;
  nama: string;
  usia: string;
  kalori: string;
  status: StatusResepType;
  image: string;
  bahan?: string;
  langkah?: string;
  protein?: string;
  karbohidrat?: string;
  lemak?: string;
  tips?: string;
};

export type UsiaResepType = '6-8 bulan' | '9-11 bulan' | '12-24 bulan' | '24+ bulan';

export type TambahResepForm = {
  image: File | null;
  imagePreview: string;
  nama: string;
  usia: '' | UsiaResepType;
  bahan: string;
  langkah: string;
  protein: string;
  karbohidrat: string;
  lemak: string;
  kalori: string;
  tips: string;
};

export type Balita = {
  id: number;
  nama: string;
  jenisKelamin: 'Laki - laki' | 'Perempuan';
  usia: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaOrtu: string;
  email: string;
  kondisi: KondisiType;
  terakhir: string;
};

export type RiwayatPemeriksaan = {
  id: number;
  tanggal: string;
  bb: string;
  tb: string;
  lk: string;
  lila: string;
  kondisi: KondisiType;
  catatan: string;
  bahanMakanan: string[];
  diedit?: string;
  canEdit: boolean;
};

export type PemeriksaanForm = {
  nama: string;
  jenisKelamin: JenisKelaminFormType;
  usia: string;
  tempatLahir: string;
  tanggalLahir: string;
  namaOrtu: string;
  email: string;
  bb: string;
  tb: string;
  lk: string;
  lila: string;
  catatan: string;
  bahanMakanan: string[];
  kondisi: KondisiFormType;
  tanggalPemeriksaan: string;
};

export type ToastType = 'success' | 'delete' | 'error';

export type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
} | null;