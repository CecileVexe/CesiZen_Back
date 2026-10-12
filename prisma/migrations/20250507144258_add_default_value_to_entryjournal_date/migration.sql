-- AlterTable
-- CURRENT_DATE au lieu de CURRENT_TIMESTAMP(3) : TiDB (et MySQL strict) refusent un DEFAULT timestamp sur une colonne DATE
ALTER TABLE `journalentry` MODIFY `date` DATE NOT NULL DEFAULT (CURRENT_DATE);
