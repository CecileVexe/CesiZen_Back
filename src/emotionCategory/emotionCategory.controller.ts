import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmotionCategoryService } from './emotionCategory.service';
import { CreateEmotionCategoryDto } from './dto/create-emotionCategory.dto';
import { UpdateEmotionCategoryDto } from './dto/update-emotionCategory.dto';

@Controller('emotionCategory')
export class CategoryController {
  constructor(private readonly EmotionCategory: EmotionCategoryService) {}

  @Post()
  create(@Body() createEmotionCategoryDto: CreateEmotionCategoryDto) {
    return this.EmotionCategory.create(createEmotionCategoryDto);
  }

  @Get()
  findAll() {
    return this.EmotionCategory.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.EmotionCategory.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmotionCategoryDto: UpdateEmotionCategoryDto,
  ) {
    return this.EmotionCategory.update(id, updateEmotionCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.EmotionCategory.remove(id);
  }
}
