import { Module } from '@nestjs/common';
import { RessourceService } from './Ressource.service';
import { RessourceController } from './Ressource.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RessourceController],
  providers: [RessourceService, PrismaService],
})
export class RessourceModule {}
