import { Module } from '@nestjs/common';
import { CategoryService } from './articleCategory.service';
import { CategoryController } from './articleCategory.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
})
export class ArticleCategoryModule {}
