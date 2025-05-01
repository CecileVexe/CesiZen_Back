import { Module } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { JournalEntryController } from './journal-entry.controller';

@Module({
  controllers: [JournalEntryController],
  providers: [JournalEntryService],
})
export class JournalEntryModule {}
