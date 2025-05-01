-- DropForeignKey
ALTER TABLE `emotionaljournal` DROP FOREIGN KEY `EmotionalJournal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_articleId_fkey`;

-- DropForeignKey
ALTER TABLE `favorite` DROP FOREIGN KEY `Favorite_userId_fkey`;

-- DropForeignKey
ALTER TABLE `journalentry` DROP FOREIGN KEY `JournalEntry_journalId_fkey`;

-- DropIndex
DROP INDEX `EmotionalJournal_userId_fkey` ON `emotionaljournal`;

-- DropIndex
DROP INDEX `Favorite_articleId_fkey` ON `favorite`;

-- DropIndex
DROP INDEX `JournalEntry_journalId_fkey` ON `journalentry`;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favorite` ADD CONSTRAINT `Favorite_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmotionalJournal` ADD CONSTRAINT `EmotionalJournal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JournalEntry` ADD CONSTRAINT `JournalEntry_journalId_fkey` FOREIGN KEY (`journalId`) REFERENCES `EmotionalJournal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
