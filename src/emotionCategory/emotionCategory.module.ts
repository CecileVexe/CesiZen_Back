import { Module } from '@nestjs/common';
import { CategoryService } from './emotionCategory.service';
import { CategoryController } from './emotionCategory.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class CategoryModule {}
