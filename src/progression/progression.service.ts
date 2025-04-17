import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProgressionDto } from './dto/update-progression.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateProgressionDto } from './dto/create-progression.dto';
import { ProgressionType } from 'src/utils/types/PrismaApiModel.type';

@Injectable()
export class ProgressionService {
  constructor(private readonly prisma: PrismaService) {}

  async initializeProgression(createProgressionDto: CreateProgressionDto) {
    const { ArticleId, UserId } = createProgressionDto;
    const initializerProgression: Array<ProgressionType> = [];

    const steps = await this.prisma.step.findMany({
      where: { ArticleId },
    });

    if (steps.length === 0) {
      throw new NotFoundException('Aucune étapes trouvées');
    }

    const isAlreadyInAProgression = await this.prisma.progression.findFirst({
      where: { UserId },
    });

    if (isAlreadyInAProgression === null) {
      for (const step of steps) {
        const existingProgression = await this.prisma.progression.findFirst({
          where: { UserId, stepId: step.id, completed: false },
        });

        if (!existingProgression) {
          const progression = await this.prisma.progression.create({
            data: {
              UserId,
              stepId: step.id,
              completed: false,
            },
          });
          initializerProgression.push(progression);
        } else {
          throw new BadRequestException(
            'Une erreur de validation est survenue (données dupliquées)',
          );
        }
      }
      if (initializerProgression.length === 0) {
        throw new InternalServerErrorException(
          "Une erreur est survenue durant l'initilisation de la progression",
        );
      }
      return {
        data: initializerProgression,
        message: 'Progression initialisé avec succès',
      };
    } else {
      throw new BadRequestException(
        'Ce citoyen est déjà inscris à une Article',
      );
    }
  }

  async getProgression(UserId: string, ArticleId: string) {
    if (!UserId || !ArticleId) {
      throw new BadRequestException(
        'Veuillez renseigner le user et la Article',
      );
    }
    try {
      await this.initializeProgression({
        UserId,
        ArticleId,
      });

      const progression = await this.prisma.progression.findMany({
        where: {
          UserId,
          step: {
            ArticleId,
          },
        },
        include: {
          step: true,
        },
      });

      return {
        data: progression,
        message: 'Progression créé et récupéré avec succès',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      //------Permet de bien renvoyer les erreurs de initializeProgression si il y en a
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      //-----------------------//
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async updateProgression(
    id: string,
    updateProgressionDto: UpdateProgressionDto,
  ) {
    const progression = await this.prisma.progression.findUnique({
      where: { id },
    });

    if (!progression) {
      throw new NotFoundException('Progression non trouvé pour la mise à jour');
    }

    try {
      const updatedProgression = await this.prisma.progression.update({
        where: { id },
        data: {
          completed: updateProgressionDto.completed,
          dateCompleted: updateProgressionDto.completed ? new Date() : null,
        },
      });
      if (!updatedProgression) {
        throw new NotFoundException(
          'Progression non trouvé pour la mise à jour',
        );
      }
      return {
        data: updatedProgression,
        message: 'Progression complétée avec succès',
      };
    } catch (error) {
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

  async deleteProgression(UserId: string, ArticleId: string) {
    if (!UserId || !ArticleId) {
      throw new BadRequestException(
        'Veuillez renseigner le user et la Article',
      );
    }
    try {
      const progression = await this.prisma.progression.deleteMany({
        where: {
          UserId,
          step: {
            ArticleId,
          },
        },
      });

      return {
        data: progression,
        message: 'Progression supprimé avec succès',
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Une erreur de validation est survenue (données dupliquées)',
        );
      }
      //------Permet de bien renvoyer les erreurs de initializeProgression si il y en a
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof NotFoundException) {
        throw error;
      }
      //-----------------------//
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  private getCurrentUTCDate(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  async deleteProgressionForExpiredArticles() {
    const todayUTC = this.getCurrentUTCDate(); // Date du jour en UTC sans l'heure

    console.log(
      'Checking for expired Articles with deadline before:',
      todayUTC,
    );

    const expiredArticles = await this.prisma.Article.findMany({
      where: { deadLine: { lte: todayUTC } },
      select: { id: true },
    });

    const ArticleIds = expiredArticles.map((r) => r.id);

    console.log(
      `Found ${ArticleIds.length} expired Articles to delete progressions for.`,
    );

    if (ArticleIds.length > 0) {
      await this.prisma.progression.deleteMany({
        where: {
          step: { ArticleId: { in: ArticleIds } },
        },
      });
      console.log(`Deleted progressions for expired Articles.`);
    } else {
      console.log('No expired Articles found.');
    }
  }
}
