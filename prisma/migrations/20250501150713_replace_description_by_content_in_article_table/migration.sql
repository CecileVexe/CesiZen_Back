/*
  Warnings:

  - You are about to drop the column `description` on the `article` table. All the data in the column will be lost.
  - Added the required column `content` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `description`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL;
