/*
  Warnings:

  - Added the required column `description` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingTime` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` ADD COLUMN `description` VARCHAR(191) NOT NULL,
    ADD COLUMN `readingTime` INTEGER NOT NULL,
    MODIFY `content` TEXT NOT NULL;
