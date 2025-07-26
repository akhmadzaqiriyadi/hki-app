// src/lib/types.ts

// ENUM untuk semua kemungkinan status pendaftaran
export type StatusPendaftaran =
  | "draft"
  | "submitted"
  | "review"
  | "revisi"
  | "approved"
  | "submitted_to_djki"
  | "rejected"
  | "granted"
  | "diproses_hki"; // Fallback untuk data lama

// --- TIPE DATA BARU UNTUK PENCIPTA ---
export interface Pencipta {
  id: string;
  pendaftaran_id: string;
  nama_lengkap: string;
  nik: string | null;
  nip_nim: string | null;
  email: string | null;
  no_hp: string | null;
  jenis_kelamin: string | null;
  kewarganegaraan: string | null;
  negara: string | null;
  provinsi: string | null;
  kota: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  alamat_lengkap: string | null;
  kode_pos: string | null;
  fakultas: string | null;
  program_studi: string | null;
  createdAt: string;
}

// Tipe data dasar untuk objek Pendaftaran
export interface Pendaftaran {
  id: string;
  judul: string;
  status: StatusPendaftaran;
  createdAt: string;
  pencipta: Pencipta[];
  [key: string]: any; 
}