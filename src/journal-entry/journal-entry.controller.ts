import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JournalEntryService } from './journal-entry.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { JournalEntryType } from 'src/utils/types/PrismaApiModel.type';

@Controller('journal-entry')
export class JournalEntryController {
  constructor(private readonly journalEntryService: JournalEntryService) {}

  @Post()
  create(
    @Body() createJournalEntryDto: CreateJournalEntryDto,
  ): Promise<ApiReturns<JournalEntryType | null>> {
    return this.journalEntryService.create(createJournalEntryDto);
  }

  @Get('all')
  findAll(
    @Query('journalId') journalId: string,
    @Query('userId') userId: string,
  ): Promise<ApiReturns<JournalEntryType[] | null>> {
    return this.journalEntryService.findAllFromUserByJournal(userId, journalId);
  }

  @Get('date/:date')
  findOneByDate(
    @Param('date') date: string,
    @Query('userId') userId: string,
  ): Promise<ApiReturns<JournalEntryType | null>> {
    return this.journalEntryService.findOneFromUserByJournalByDate(
      userId,
      date,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ): Promise<ApiReturns<JournalEntryType | null>> {
    return this.journalEntryService.findOneFromUserByJournal(userId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body() updateJournalEntryDto: UpdateJournalEntryDto,
  ): Promise<ApiReturns<JournalEntryType | null>> {
    return this.journalEntryService.updateFromUser(id, updateJournalEntryDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userID') userId: string,
  ): Promise<{
    message: string;
  }> {
    return this.journalEntryService.removeFromUser(userId, id);
  }
}
