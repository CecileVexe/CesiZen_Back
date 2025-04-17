import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async getFavoritesForClient(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: String(userId) },
      include: {
        favorites: {
          include: {
            article: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Le client avec l'ID ${userId} n'existe pas.`,
      );
    }

    return user.favorites.map((favorite) => ({
      id: favorite.id,
      article: favorite.article,
    }));
  }

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { userId, articleId } = createFavoriteDto;

    const ArticleExistante = await this.prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!ArticleExistante) {
      throw new NotFoundException(
        `La Article avec l'id ${articleId} n'existe pas.`,
      );
    }

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_articleId: {
          userId: String(userId),
          articleId: String(articleId),
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Ce favori existe déjà.');
    }

    return await this.prisma.favorite.create({
      data: {
        user: { connect: { id: String(userId) } },
        article: { connect: { id: String(articleId) } },
      },
    });
  }

  async removeFavorite(removeFavoriteDto: CreateFavoriteDto) {
    const { userId, articleId } = removeFavoriteDto;

    try {
      return await this.prisma.favorite.delete({
        where: {
          userId_articleId: {
            userId: String(userId),
            articleId: String(articleId),
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Favori non trouvé.');
    }
  }
}
