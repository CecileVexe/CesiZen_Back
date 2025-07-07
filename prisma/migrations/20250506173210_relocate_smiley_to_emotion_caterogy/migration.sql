/*
  Warnings:

  - You are about to drop the column `smiley` on the `emotion` table. All the data in the column will be lost.
  - Added the required column `smiley` to the `EmotionCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Emotion` DROP COLUMN `smiley`;

-- AlterTable
ALTER TABLE `EmotionCategory` ADD COLUMN `smiley` VARCHAR(150) NOT NULL;
