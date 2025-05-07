import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { PrismaService } from 'src/prisma.service';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class JournalEntryService {
  constructor(private prisma: PrismaService) {}

  async create(createJournalEntryDto: CreateJournalEntryDto) {
    try {
      const { userId, ...entryData } = createJournalEntryDto;

      let journal = await this.prisma.emotionalJournal.findFirst({
        where: { userId },
        select: { id: true },
      });

      if (!journal) {
        journal = await this.prisma.emotionalJournal.create({
          data: { userId },
          select: { id: true },
        });
      }

      const journalEntry = await this.prisma.journalEntry.create({
        data: {
          ...entryData,
          journalId: journal.id,
        },
        select: {
          id: true,
          date: true,
          description: true,
          updatedAt: true,
          emotionId: true,
        },
      });

      return {
        data: journalEntry,
        message: 'Entrée de journal créée avec succès',
      };
    } catch (error) {
      console.error(error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées).',
        );
      }

      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la création.',
      );
    }
  }

  async findOneFromUserByJournal(userId: string, id: string) {
    try {
      const journalEntry = await this.prisma.journalEntry.findFirst({
        where: {
          id,
          journal: {
            userId: userId,
          },
        },
        select: {
          id: true,
          date: true,
          description: true,
          updatedAt: true,
          emotionId: true,
        },
      });

      return {
        data: journalEntry,
        message: 'Entrée de journal créé avec succès',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findOneFromUserByJournalByDate(userId: string, dateString: string) {
    try {
      const parsedDate = new Date(dateString);
      const start = startOfDay(parsedDate);
      const end = endOfDay(parsedDate);

      const journalEntry = await this.prisma.journalEntry.findFirst({
        where: {
          date: {
            gte: start,
            lte: end,
          },
          journal: {
            userId,
          },
        },
        select: {
          id: true,
          date: true,
          description: true,
          updatedAt: true,
          emotionId: true,
        },
      });

      return {
        data: journalEntry,
        message: 'Entrée de journal récupérée avec succès',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findAllFromUserByJournal(userId: string, journalId: string) {
    try {
      const journalEntries = await this.prisma.journalEntry.findMany({
        where: {
          journalId,
          journal: {
            userId: userId,
          },
        },
        select: {
          id: true,
          date: true,
          description: true,
          updatedAt: true,
          emotionId: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      return {
        data: journalEntries,
        message: 'Entrées de journal récupérées avec succès',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      if (error instanceof InternalServerErrorException) throw error;

      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async updateFromUser(id: string, updateDto: UpdateJournalEntryDto) {
    try {
      const existingEntry = await this.prisma.journalEntry.findFirst({
        where: {
          id,
          journal: {
            userId: updateDto.userId,
          },
        },
      });

      if (!existingEntry) {
        throw new NotFoundException(
          'Entrée de journal non trouvée ou non accessible.',
        );
      }

      const updatedEntry = await this.prisma.journalEntry.update({
        where: { id },
        data: {
          description: updateDto.description,
          emotionId: updateDto.emotionId,
        },
      });

      return {
        data: updatedEntry,
        message: 'Entrée de journal mise à jour avec succès',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour',
      );
    }
  }

  async removeFromUser(userId: string, id: string) {
    try {
      const existingEntry = await this.prisma.journalEntry.findFirst({
        where: {
          id,
          journal: {
            userId: userId,
          },
        },
      });

      if (!existingEntry) {
        throw new NotFoundException(
          'Entrée de journal non trouvée ou non accessible.',
        );
      }

      await this.prisma.journalEntry.delete({
        where: { id },
      });

      return {
        message: 'Entrée de journal supprimée avec succès',
        statusCode: 200,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la suppression',
      );
    }
  }
}
