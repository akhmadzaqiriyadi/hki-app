-- DropForeignKey
ALTER TABLE `pendaftaran` DROP FOREIGN KEY `pendaftaran_user_id_fkey`;

-- DropIndex
DROP INDEX `pendaftaran_user_id_fkey` ON `pendaftaran`;

-- AddForeignKey
ALTER TABLE `pendaftaran` ADD CONSTRAINT `pendaftaran_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
