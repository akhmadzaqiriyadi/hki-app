-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('User', 'Admin') NOT NULL DEFAULT 'User',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pendaftaran` (
    `id` VARCHAR(191) NOT NULL,
    `judul` VARCHAR(191) NOT NULL,
    `jenis_pemilik` VARCHAR(191) NOT NULL,
    `produk_hasil` VARCHAR(191) NULL,
    `jenis_karya` VARCHAR(191) NULL,
    `sub_jenis_karya` VARCHAR(191) NULL,
    `kota_diumumkan` VARCHAR(191) NULL,
    `tanggal_diumumkan` DATETIME(3) NULL,
    `deskripsi_karya` TEXT NULL,
    `status` ENUM('draft', 'submitted', 'review', 'revisi', 'approved', 'submitted_to_djki', 'rejected', 'granted') NOT NULL DEFAULT 'draft',
    `catatan_revisi` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `lampiran_karya_url` VARCHAR(191) NULL,
    `surat_pernyataan_url` VARCHAR(191) NULL,
    `scan_ktp_kolektif_url` VARCHAR(191) NULL,
    `surat_pengalihan_url` VARCHAR(191) NULL,
    `bukti_transfer_url` VARCHAR(191) NULL,
    `sertifikat_hki_url` VARCHAR(191) NULL,
    `sertifikat_hki_filename` VARCHAR(191) NULL,
    `sertifikat_uploaded_at` DATETIME(3) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pencipta` (
    `id` VARCHAR(191) NOT NULL,
    `nama_lengkap` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NULL,
    `nip_nim` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `no_hp` VARCHAR(191) NULL,
    `jenis_kelamin` VARCHAR(191) NULL,
    `kewarganegaraan` VARCHAR(191) NULL,
    `negara` VARCHAR(191) NULL,
    `provinsi` VARCHAR(191) NULL,
    `kota` VARCHAR(191) NULL,
    `kecamatan` VARCHAR(191) NULL,
    `kelurahan` VARCHAR(191) NULL,
    `alamat_lengkap` TEXT NULL,
    `kode_pos` VARCHAR(191) NULL,
    `fakultas` VARCHAR(191) NULL,
    `program_studi` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pendaftaran_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pencipta` ADD CONSTRAINT `pencipta_pendaftaran_id_fkey` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
