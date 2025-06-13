/*
  Warnings:

  - A unique constraint covering the columns `[bannerId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Image` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Article_bannerId_key` ON `Article`(`bannerId`);
