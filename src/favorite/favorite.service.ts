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

  async getFavoritesForClient(UserId: string) {
    // Vérifier que le client existe et récupérer ses favoris
    const user = await this.prisma.user.findUnique({
      where: { id: String(UserId) },
      include: {
        favorites: {
          // Inclure les infos sur la Article favorite
          include: {
            Article: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Le client avec l'ID ${UserId} n'existe pas.`,
      );
    }

    // Retourne la liste des favoris pour ce client
    return user.favorites.map((favorite) => ({
      id: favorite.id,
      Article: favorite.Article,
    }));
  }

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { UserId, ArticleId } = createFavoriteDto;

    const ArticleExistante = await this.prisma.Article.findUnique({
      where: { id: ArticleId },
    });
    if (!ArticleExistante) {
      throw new NotFoundException(
        `La Article avec l'id ${ArticleId} n'existe pas.`,
      );
    }

    // Vérifier si le favori existe déjà pour éviter les doublons
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        // Le nom composite est généré automatiquement à partir des champs uniques définis
        UserId_ArticleId: {
          UserId: String(UserId),
          ArticleId: String(ArticleId),
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Ce favori existe déjà.');
    }

    // Créer le favori en connectant le user et la resource
    return await this.prisma.favorite.create({
      data: {
        user: { connect: { id: String(UserId) } },
        Article: { connect: { id: String(ArticleId) } },
      },
    });
  }

  async removeFavorite(removeFavoriteDto: CreateFavoriteDto) {
    const { UserId, ArticleId } = removeFavoriteDto;

    try {
      return await this.prisma.favorite.delete({
        where: {
          UserId_ArticleId: {
            UserId: String(UserId),
            ArticleId: String(ArticleId),
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Favori non trouvé.');
    }
  }
}
