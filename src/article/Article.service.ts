/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-Article.dto';
import { UpdateArticleDto } from './dto/update-Article.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    try {
      const { bannerBytes, ...articleData } = createArticleDto;

      let banner: { id: string } | null = null;

      if (bannerBytes) {
        banner = await this.prisma.image.create({
          data: {
            url: Buffer.from(bannerBytes, 'base64'),
          },
          select: { id: true },
        });
      }

      const article = await this.prisma.article.create({
        data: {
          ...articleData,
          bannerId: banner?.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          category: {
            select: { name: true, id: true },
          },
          banner: {
            select: { url: true },
          },
        },
      });

      return { data: article, message: 'Articles créé avec succès' };
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

      const validOrderByFields = ['title', 'createdAt', 'updatedAt'];

      if (!validOrderByFields.includes(orderBy)) {
        throw new BadRequestException('Le paramètre "orderBy" est invalide.');
      }

      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const articles = await this.prisma.article.findMany({
        skip,
        take,
        orderBy: {
          [orderBy]: sortBy,
        },
        select: {
          id: true,
          title: true,
          description: true,
          banner: {
            select: {
              url: true,
            },
          },
        },
      });

      if (!articles || articles.length === 0) {
        throw new NotFoundException('Aucune Articles trouvé');
      }
      const totalArticles = await this.prisma.article.count();

      return {
        data: articles,
        total: totalArticles,
        page,
        pageSize,
        message: 'Articles récupérés avec succès',
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
      const article = await this.prisma.article.findUnique({
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          banner: {
            select: { url: true },
          },
        },
      });

      if (!article) {
        throw new NotFoundException('Articles non trouvé');
      }

      return { data: article, message: 'Articles récupéré avec succès' };
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

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    try {
      const article = await this.prisma.article.update({
        data: updateArticleDto,
        where: { id: id },
        select: {
          id: true,
          title: true,
          description: true,
          banner: {
            select: { url: true },
          },
        },
      });

      if (!article) {
        throw new NotFoundException('Article non trouvé pour la mise à jour');
      }

      return { data: article, message: 'Articles mis à jour avec succès' };
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
      const article = await this.prisma.article.findUnique({
        where: { id: id },
      });
      if (!article) {
        throw new NotFoundException('Articles non trouvé');
      }

      await this.prisma.article.delete({ where: { id: id } });
      return { message: 'Articles supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer cette Articles : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du citoyen',
      );
    }
  }
}
