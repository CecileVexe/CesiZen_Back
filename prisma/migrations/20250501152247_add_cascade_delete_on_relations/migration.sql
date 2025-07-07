-- DropForeignKey
ALTER TABLE `EmotionalJournal` DROP FOREIGN KEY `EmotionalJournal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `Favorite` DROP FOREIGN KEY `Favorite_userId_fkey`;

-- DropForeignKey
ALTER TABLE `JournalEntry` DROP FOREIGN KEY `JournalEntry_journalId_fkey`;

-- DropIndex
DROP INDEX `EmotionalJournal_userId_fkey` ON `EmotionalJournal`;

-- DropIndex
DROP INDEX `Favorite_articleId_fkey` ON `Favorite`;

-- DropIndex
DROP INDEX `JournalEntry_journalId_fkey` ON `JournalEntry`;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmotionalJournal` ADD CONSTRAINT `EmotionalJournal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `EmotionalJournal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
