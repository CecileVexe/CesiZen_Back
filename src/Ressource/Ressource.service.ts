/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRessourceDto } from './dto/create-Ressource.dto';
import { UpdateRessourceDto } from './dto/update-Ressource.dto';
import { PrismaService } from 'src/prisma.service';
import { RessourceStatus } from 'src/utils/ressourceStatus.enum';

@Injectable()
export class RessourceService {
  constructor(private prisma: PrismaService) {}

  async create(createRessourceDto: CreateRessourceDto) {
    try {
      const { fileBytes, bannerBytes, ...ressourceData } = createRessourceDto;

      let file: { id: string } | null = null;
      let banner: { id: string } | null = null;

      if (fileBytes) {
        file = await this.prisma.file.create({
          data: {
            path: Buffer.from(fileBytes, 'base64'),
          },
          select: { id: true },
        });
      }

      if (bannerBytes) {
        banner = await this.prisma.image.create({
          data: {
            url: Buffer.from(bannerBytes, 'base64'),
          },
          select: { id: true },
        });
      }

      const Ressource = await this.prisma.ressource.create({
        data: {
          ...ressourceData,
          fileId: file?.id,
          bannerId: banner?.id,
          status: ressourceData.status || RessourceStatus.EN_ATTENTE,
        },
        select: {
          id: true,
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true, id: true },
          },
          category: {
            select: { name: true, id: true },
          },
          banner: {
            select: { url: true },
          },
          step: {
            select: { id: true, title: true, description: true, order: true },
          },
        },
      });

      return { data: Ressource, message: 'Ressources créé avec succès' };
    } catch (error) {
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

  async findAll(
    page: number = 1,
    pageSize: number = 50,
    orderBy: string = 'createdAt',
    sortBy: string = 'desc',
  ) {
    try {
      if (page <= 0 || pageSize <= 0) {
        throw new BadRequestException(
          'Les paramètres page et pageSize doivent être supérieurs à 0',
        );
      }

      if (sortBy !== 'asc' && sortBy !== 'desc') {
        throw new BadRequestException(
          'Le paramètre "sort" doit être "asc" ou "desc"',
        );
      }

      if (pageSize > 100) {
        throw new BadRequestException('Nombre de retour maximum dépassé');
      }

      const validOrderByFields = [
        'email',
        'name',
        'surname',
        'createdAt',
        'updatedAt',
      ];

      if (!validOrderByFields.includes(orderBy)) {
        throw new BadRequestException('Le paramètre "orderBy" est invalide.');
      }

      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const Ressources = await this.prisma.ressource.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          id: true,
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { path: true, id: true },
          },
        },
      });

      if (!Ressources || Ressources.length === 0) {
        throw new NotFoundException('Aucune Ressources trouvé');
      }
      const totalRessources = await this.prisma.ressource.count();

      return {
        data: Ressources,
        total: totalRessources,
        page,
        pageSize,
        message: 'Ressources récupérés avec succès',
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
      const Ressource = await this.prisma.ressource.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { id: true, path: true },
          },
          step: {
            select: { id: true, title: true, description: true, order: true },
          },
          comment: {
            select: {
              title: true,
              description: true,
              id: true,
              updatedAt: true,
              citizen: {
                select: {
                  name: true,
                  surname: true,
                },
              },
            },
          },
        },
      });

      if (!Ressource) {
        throw new NotFoundException('Ressources non trouvé');
      }

      return { data: Ressource, message: 'Ressources récupéré avec succès' };
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

  async update(id: string, updateRessourceDto: UpdateRessourceDto) {
    try {
      const Ressource = await this.prisma.ressource.update({
        data: updateRessourceDto,
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          maxParticipant: true,
          nbParticipant: true,
          deadLine: true,
          isValidate: true,
          status: true,
          file: {
            select: { id: true, path: true },
          },
        },
      });

      if (!Ressource) {
        throw new NotFoundException('Ressource non trouvé pour la mise à jour');
      }

      return { data: Ressource, message: 'Ressources mis à jour avec succès' };
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
      const Ressource = await this.prisma.ressource.findUnique({
        where: { id: id },
      });
      if (!Ressource) {
        throw new NotFoundException('Ressources non trouvé');
      }

      await this.prisma.ressource.delete({ where: { id: id } });
      return { message: 'Ressources supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette Ressources : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
