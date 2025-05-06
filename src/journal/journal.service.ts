import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
} from 'date-fns';
import { PrismaService } from 'src/prisma.service';
import { CreateJournalDto } from './dto/create-journal.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async create(createJournalDto: CreateJournalDto) {
    try {
      const journalEntry = await this.prisma.emotionalJournal.create({
        data: createJournalDto,
        select: {
          id: true,
          userId: true,
          updatedAt: true,
          entries: {
            select: {
              id: true,
              date: true,
              emotionId: true,
            },
          },
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

  async findUserJournal(
    userId: string,
    period: 'week' | 'month' | 'year',
    targetDateStr?: string,
  ) {
    try {
      const targetDate = targetDateStr ? parseISO(targetDateStr) : new Date();
      let startDate: Date;
      let endDate: Date;

      switch (period) {
        case 'week':
          startDate = startOfWeek(targetDate, { weekStartsOn: 1 }); // lundi
          endDate = endOfWeek(targetDate, { weekStartsOn: 1 });
          break;
        case 'month':
          startDate = startOfMonth(targetDate);
          endDate = endOfMonth(targetDate);
          break;
        case 'year':
          startDate = startOfYear(targetDate);
          endDate = endOfYear(targetDate);
          break;
        default:
          startDate = startOfWeek(targetDate, { weekStartsOn: 1 });
          endDate = endOfWeek(targetDate, { weekStartsOn: 1 });
      }

      const journalEntry = await this.prisma.emotionalJournal.findFirst({
        where: {
          userId,
        },
        select: {
          id: true,
          userId: true,
          updatedAt: true,
          entries: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
            select: {
              id: true,
              date: true,
              emotion: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                  emotionCategory: {
                    select: {
                      id: true,
                      name: true,
                      color: true,
                      smiley: true,
                    },
                  },
                },
              },
            },
          },
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

  async remove(userId: string) {
    try {
      const existingEntry = await this.prisma.emotionalJournal.findFirst({
        where: {
          userId,
        },
      });

      if (!existingEntry) {
        throw new NotFoundException(
          'Entrée de journal non trouvée ou non accessible.',
        );
      }

      return {
        message: 'Journal supprimé avec succès',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la suppression',
      );
    }
  }
}
