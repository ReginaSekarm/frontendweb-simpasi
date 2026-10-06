export type NotifType = 'komentar';

export type Notifikasi = {
  id: number;
  type: NotifType;
  dariNama: string;
  deskripsi: string;
  targetNama?: string;
  resepId?: number;
  timestamp: string;
  dibaca: boolean;
};