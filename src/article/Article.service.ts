import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(articleData: CreateArticleDto, banner?: Express.Multer.File) {
    try {
      let bannerRecord: { id: string } | null = null;

      if (banner) {
        if (!banner.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          throw new BadRequestException(
            'Seuls les fichiers JPEG ou PNG sont autorisés.',
          );
        }

        const maxSizeInBytes = 1 * 1024 * 1024; // 1 Mo
        if (banner.size > maxSizeInBytes) {
          throw new BadRequestException(
            'Le fichier est trop volumineux (max 1 Mo).',
          );
        }

        bannerRecord = await this.prisma.image.create({
          data: {
            url: banner.buffer,
          },
          select: { id: true },
        });
      }

      const article = await this.prisma.article.create({
        data: {
          ...articleData,
          bannerId: bannerRecord?.id,
        },
        select: {
          id: true,
          title: true,
          content: true,
          category: {
            select: { name: true, id: true },
          },
          banner: {
            select: { id: true, url: true },
          },
        },
      });

      return { data: article, message: 'Article créé avec succès' };
    } catch (error) {
      if (error instanceof BadRequestException) {
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
          content: true,
          banner: {
            select: {
              id: true,
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
          content: true,
          banner: {
            select: { id: true, url: true },
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

  async update(
    id: string,
    updateDto: UpdateArticleDto,
    banner?: Express.Multer.File,
  ) {
    try {
      const existingArticle = await this.prisma.article.findUnique({
        where: { id },
        include: { banner: true },
      });

      if (!existingArticle) {
        throw new NotFoundException('Article introuvable');
      }

      let newBannerId: string | undefined;

      if (banner) {
        if (!banner.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          throw new BadRequestException(
            'Seuls les fichiers JPEG ou PNG sont autorisés.',
          );
        }

        if (banner.size > 1 * 1024 * 1024) {
          throw new BadRequestException(
            'Le fichier est trop volumineux (max 1 Mo).',
          );
        }

        if (existingArticle.bannerId) {
          await this.prisma.image.delete({
            where: { id: existingArticle.bannerId },
          });
        }

        const newImage = await this.prisma.image.create({
          data: { url: banner.buffer },
          select: { id: true },
        });

        newBannerId = newImage.id;
      }

      const updatedArticle = await this.prisma.article.update({
        where: { id },
        data: {
          ...updateDto,
          bannerId: newBannerId ?? existingArticle.bannerId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          category: { select: { name: true, id: true } },
          banner: { select: { id: true, url: true } },
        },
      });

      return {
        data: updatedArticle,
        message: 'Article mis à jour avec succès',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour.',
      );
    }
  }

  async remove(id: string) {
    try {
      const article = await this.prisma.article.findUnique({
        where: { id },
        select: { bannerId: true },
      });

      if (!article) {
        throw new NotFoundException('Article introuvable');
      }

      if (article.bannerId) {
        await this.prisma.image.delete({
          where: { id: article.bannerId },
        });
      }

      await this.prisma.article.delete({
        where: { id },
      });

      return { message: 'Article supprimé avec succès' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erreur lors de la suppression');
    }
  }
}
