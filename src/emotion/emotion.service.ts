import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmotionService {
  constructor(private prisma: PrismaService) {}
  async create(createEmotionDto: CreateEmotionDto) {
    try {
      const emotion = await this.prisma.emotion.create({
        data: createEmotionDto,
        select: {
          id: true,
          name: true,
          color: true,
          emotionCategoryId: true,
          emotionCategory: {
            select: {
              name: true,
              smiley: true,
              color: true,
              id: true,
            },
          },
        },
      });

      if (!emotion) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création de l'émotion`,
        );
      }

      return { data: emotion, message: 'Emotion créé avec succès' };
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

  async findAll() {
    try {
      const categories = await this.prisma.emotion.findMany({
        select: {
          id: true,
          name: true,
          color: true,
          emotionCategoryId: true,
          emotionCategory: {
            select: {
              name: true,
              smiley: true,
              color: true,
              id: true,
            },
          },
        },
      });

      if (!categories || categories.length === 0) {
        throw new NotFoundException('Aucune émotions trouvées');
      }
      const totalEmotions = await this.prisma.emotion.count();

      return {
        data: categories,
        total: totalEmotions,
        message: 'Emotions récupérés avec succès',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async findOne(id: string) {
    try {
      const emotion = await this.prisma.emotion.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          color: true,
          emotionCategoryId: true,
          emotionCategory: {
            select: {
              name: true,
              smiley: true,
              color: true,
              id: true,
            },
          },
        },
      });

      if (!emotion) {
        throw new NotFoundException('Emotion non trouvée');
      }

      return {
        data: emotion,
        message: 'Emotion récupérée avec succès',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async update(id: string, updateDto: UpdateEmotionDto) {
    try {
      const emotion = await this.prisma.emotion.update({
        data: updateDto,
        where: { id: id },
        select: {
          id: true,
          name: true,
          color: true,
          emotionCategoryId: true,
          emotionCategory: {
            select: {
              name: true,
              smiley: true,
              color: true,
              id: true,
            },
          },
        },
      });

      if (!emotion) {
        throw new NotFoundException('Emotion non trouvée pour la mise à jour');
      }

      return {
        data: emotion,
        message: 'Emotion mis à jour avec succès',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new BadRequestException('Contrainte violée : donnée dupliquée');
      }
      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue',
      );
    }
  }

  async remove(id: string) {
    try {
      const emotion = await this.prisma.emotion.findUnique({
        where: { id: id },
      });
      if (!emotion) {
        throw new NotFoundException('Emotion non trouvée');
      }

      await this.prisma.emotion.delete({ where: { id: id } });
      return { message: 'Emotion supprimée avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette émotion : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du catégorie',
      );
    }
  }
}
