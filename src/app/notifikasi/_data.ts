import type { Notifikasi } from './_types';

export const DUMMY_NOTIFIKASI: Notifikasi[] = [
  {
    id: 1,
    type: 'komentar',
    dariNama: 'Ibu Ratna',
    deskripsi: 'mengomentari resep',
    targetNama: 'Bubur Hati Ayam',
    resepId: 3,
    timestamp: '2 jam lalu',
    dibaca: false,
  },
  {
    id: 2,
    type: 'komentar',
    dariNama: 'Ibu Sari',
    deskripsi: 'mengomentari resep',
    targetNama: 'Kue Ubi Keju',
    resepId: 4,
    timestamp: '5 jam lalu',
    dibaca: false,
  },
  {
    id: 3,
    type: 'komentar',
    dariNama: 'Ibu Dewi',
    deskripsi: 'membalas komentar Anda di resep',
    targetNama: 'Telur Santan Pisang',
    resepId: 2,
    timestamp: '1 hari lalu',
    dibaca: true,
  },
];