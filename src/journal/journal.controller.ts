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
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(@Body() createJournalDto: CreateJournalDto) {
    return this.journalService.create(createJournalDto);
  }

  @Get(':userId')
  findOne(
    @Param('userId') userId: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'week',
    @Query('targetDate') targetDate: string,
  ) {
    return this.journalService.findUserJournal(userId, period, targetDate);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.journalService.remove(userId);
  }
}
