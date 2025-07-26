// src/lib/pendaftaran/schema.ts
import { z } from "zod";

// Skema untuk satu objek pencipta
const penciptaSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap wajib diisi."),
  nik: z.string().length(16, "NIK harus 16 digit.").optional().or(z.literal('')),
  nip_nim: z.string().min(1, "NIP/NIM/NUPTK/NPM wajib diisi."),
  email: z.string().email("Format email tidak valid.").optional().or(z.literal('')),
  no_hp: z.string().min(10, "No. HP minimal 10 digit.").optional().or(z.literal('')),
  jenis_kelamin: z.string().min(1, "Jenis kelamin wajib dipilih."),
  kewarganegaraan: z.string().min(1, "Kewarganegaraan wajib diisi."),
  negara: z.string().min(1, "Negara wajib diisi."),
  provinsi: z.string().min(1, "Provinsi wajib dipilih."),
  kota: z.string().min(1, "Kota/Kabupaten wajib dipilih."),
  kecamatan: z.string().min(1, "Kecamatan wajib dipilih."),
  kelurahan: z.string().min(1, "Kelurahan/Desa wajib dipilih."),
  alamat_lengkap: z.string().min(10, "Alamat lengkap wajib diisi."),
  kode_pos: z.string().length(5, "Kode pos harus 5 digit."),
  fakultas: z.string().optional(),
  program_studi: z.string().optional(),
});

// Skema utama untuk keseluruhan formulir
export const formSchema = z.object({
  judul: z.string().min(5, "Judul karya wajib diisi."),
  jenis_pemilik: z.string().min(1, "Jenis pemilik wajib dipilih."),
  jenis_karya: z.string().min(1, "Jenis karya harus dipilih."),
  sub_jenis_karya: z.string().min(1, "Sub-jenis karya wajib diisi."),
  produk_hasil: z.string().min(1, "Produk hasil wajib diisi."),
  kota_diumumkan: z.string().min(1, "Kota pertama diumumkan wajib diisi."),
  // --- PERBAIKAN DI SINI ---
  // Hapus objek { required_error } karena tidak valid
  tanggal_diumumkan: z.date(),
  deskripsi_karya: z.string().min(20, "Deskripsi minimal 20 karakter."),
  pencipta: z.array(penciptaSchema).min(1, "Minimal harus ada satu pencipta."),
  lampiran_karya_url: z.any().refine(val => val, "Lampiran wajib diunggah."),
  surat_pernyataan_url: z.any().refine(val => val, "Surat pernyataan wajib diunggah."),
  scan_ktp_kolektif_url: z.any().refine(val => val, "Scan KTP wajib diunggah."),
  surat_pengalihan_url: z.any().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultPencipta = {
  nama_lengkap: "",
  nik: "",
  nip_nim: "",
  email: "",
  no_hp: "",
  jenis_kelamin: "",
  kewarganegaraan: "Indonesia",
  negara: "Indonesia",
  provinsi: "",
  kota: "",
  kecamatan: "",
  kelurahan: "",
  alamat_lengkap: "",
  kode_pos: "",
  fakultas: "",
  program_studi: "",
};