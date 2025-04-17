import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { EmotionType } from 'src/utils/types/PrismaApiModel.type';

@Controller('emotion')
export class EmotionController {
  constructor(private readonly EmotionService: EmotionService) {}

  @Post()
  create(
    @Body() createEmotionDto: CreateEmotionDto,
  ): Promise<ApiReturns<EmotionType | null>> {
    return this.EmotionService.create(createEmotionDto);
  }

  @Get()
  findAll(): Promise<ApiReturns<EmotionType[] | null>> {
    return this.EmotionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ApiReturns<EmotionType | null>> {
    return this.EmotionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmotionDto: UpdateEmotionDto,
  ): Promise<ApiReturns<EmotionType | null>> {
    return this.EmotionService.update(id, updateEmotionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string | { message: string }> {
    return this.EmotionService.remove(id);
  }
}
