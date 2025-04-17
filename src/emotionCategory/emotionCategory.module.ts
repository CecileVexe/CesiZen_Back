import { Module } from '@nestjs/common';
import { EmotionCategoryService } from './emotionCategory.service';
import { CategoryController } from './emotionCategory.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [EmotionCategoryService, PrismaService],
})
export class CategoryModule {}
