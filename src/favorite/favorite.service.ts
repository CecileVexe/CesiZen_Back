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

  async getFavoritesOfUser(userId: string) {
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
      throw new NotFoundException(`Utilisateur introuvable.`);
    }

    const userFavorites = user.favorites.map((favorite) => ({
      id: favorite.id,
      article: favorite.article,
    }));

    return {
      data: userFavorites,
      message: 'Favoris récupérés avec succès',
    };
  }

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { userId, articleId } = createFavoriteDto;

    const ArticleExistante = await this.prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!ArticleExistante) {
      throw new NotFoundException(`Article introuvable`);
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
