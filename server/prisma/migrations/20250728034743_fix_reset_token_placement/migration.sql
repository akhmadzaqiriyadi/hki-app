/*
  Warnings:

  - You are about to drop the column `resetPasswordExpires` on the `pendaftaran` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `pendaftaran` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pendaftaran` DROP COLUMN `resetPasswordExpires`,
    DROP COLUMN `resetPasswordToken`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetPasswordExpires` DATETIME(3) NULL,
    ADD COLUMN `resetPasswordToken` VARCHAR(191) NULL;
