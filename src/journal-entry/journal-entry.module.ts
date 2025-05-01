import { Module } from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { JournalEntryController } from './journal-entry.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [JournalEntryController],
  providers: [JournalEntryService, PrismaService],
})
export class JournalEntryModule {}
