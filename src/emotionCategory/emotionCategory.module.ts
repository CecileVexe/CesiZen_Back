import { Module } from '@nestjs/common';
import { EmotionCategoryService } from './emotionCategory.service';
import { EmotionCategoryController } from './emotionCategory.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EmotionCategoryController],
  providers: [EmotionCategoryService, PrismaService],
})
export class EmotionCategoryModule {}
