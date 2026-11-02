export type KondisiType = 'Belum Diperiksa' | 'Normal' | 'Berisiko' | 'Stunting';
export type FilterType = 'Semua' | KondisiType;
export type KondisiFormType = 'Normal' | 'Berisiko' | 'Stunting' | 'Belum Diperiksa';

export type JenisKelaminFormType = '' | 'Laki - laki' | 'Perempuan';
export type KondisiFormNullableType = '' | KondisiFormType;

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
  bb: string;
  tb: string;
  lk: string;
  lila: string;
};

export type BalitaForm = {
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
  kondisi: KondisiFormNullableType;
};

export type PemeriksaanForm = {
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

export type ConfirmDeleteType = 'balita' | 'pemeriksaan' | null;