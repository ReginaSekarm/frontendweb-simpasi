import type { Notifikasi } from './types';

export const DUMMY_NOTIFIKASI: Notifikasi[] = [
  {
    id: 1,
    type: 'komentar',
    dariNama: 'Wowo',
    deskripsi: 'mengomentari resep',
    targetNama: 'Kue Ubi Keju',
    resepId: 3,
    timestamp: '1 hari',
    dibaca: true,
  },
  {
    id: 2,
    type: 'komentar',
    dariNama: 'Uni',
    deskripsi: 'mengomentari resep',
    targetNama: 'Kue Ubi Keju',
    resepId: 4,
    timestamp: '1 hari',
    dibaca: false,
  },
];