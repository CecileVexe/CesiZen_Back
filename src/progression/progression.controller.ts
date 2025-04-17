import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  Post,
  Query,
} from '@nestjs/common';
import { ProgressionService } from './progression.service';
import { UpdateProgressionDto } from './dto/update-progression.dto';
import { Cron } from '@nestjs/schedule';
import { CreateProgressionDto } from './dto/create-progression.dto';

@Controller('progression')
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get()
  async getProgression(
    @Query('UserId') UserId: string,
    @Query('ArticleId') ArticleId: string,
  ) {
    return this.progressionService.getProgression(UserId, ArticleId);
  }

  @Post()
  async create(@Body() createProgressionDto: CreateProgressionDto) {
    return this.progressionService.initializeProgression(createProgressionDto);
  }
  @Put(':id')
  async updateProgression(
    @Param('id') id: string,
    @Body() updateProgressionDto: UpdateProgressionDto,
  ) {
    return this.progressionService.updateProgression(id, updateProgressionDto);
  }

  @Delete('expired')
  async deleteExpiredProgressions() {
    await this.progressionService.deleteProgressionForExpiredArticles();
    return { message: 'Progression expirées supprimées avec succès' };
  }
  @Delete()
  async deleteProgression(
    @Query('UserId') UserId: string,
    @Query('ArticleId') ArticleId: string,
  ) {
    return await this.progressionService.deleteProgression(UserId, ArticleId);
  }

  @Cron('0 0 * * *') // S'exécute tous les jours à minuit
  async handleCron() {
    await this.progressionService.deleteProgressionForExpiredArticles();
    console.log('Scheduled cleanup of expired progressions executed.');
  }
}
