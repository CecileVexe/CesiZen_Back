import { Module } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EmotionController],
  providers: [EmotionService, PrismaService],
})
export class EmotionModule {}
