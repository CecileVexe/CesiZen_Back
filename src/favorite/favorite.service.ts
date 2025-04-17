import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async getFavoritesForClient(citizenId: string) {    

    // Vérifier que le client existe et récupérer ses favoris
    const citizen = await this.prisma.citizen.findUnique({
      where: { id: String(citizenId) },
      include: { 
        favorites: { 
          // Inclure les infos sur la ressource favorite
          include: { 
            ressource: true 
          } 
        } 
      },
    });

    if (!citizen) {
      throw new NotFoundException(`Le client avec l'ID ${citizenId} n'existe pas.`);
    }

    // Retourne la liste des favoris pour ce client
    return citizen.favorites.map((favorite) => ({
      id: favorite.id,
      ressource: favorite.ressource,
    }))
  }

  async createFavorite(createFavoriteDto: CreateFavoriteDto) {
    const { citizenId, ressourceId } = createFavoriteDto;

    const ressourceExistante = await this.prisma.ressource.findUnique({
      where: { id: ressourceId },
    });
    if (!ressourceExistante) {
      throw new NotFoundException(`La ressource avec l'id ${ressourceId} n'existe pas.`);
    }

    // Vérifier si le favori existe déjà pour éviter les doublons
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        // Le nom composite est généré automatiquement à partir des champs uniques définis
        citizenId_ressourceId: { citizenId: String(citizenId), ressourceId: String(ressourceId) },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Ce favori existe déjà.');
    }

    // Créer le favori en connectant le citizen et la resource
    return await this.prisma.favorite.create({
      data: {
        citizen: { connect: { id: String(citizenId) } },
        ressource: { connect: { id: String(ressourceId) } },
      },
    });
  }

  async removeFavorite(removeFavoriteDto: CreateFavoriteDto) {
    const { citizenId, ressourceId } = removeFavoriteDto;

    try {
      return await this.prisma.favorite.delete({
        where: {
          citizenId_ressourceId: {
            citizenId: String(citizenId),
            ressourceId: String(ressourceId),
          },
        },
      });
    } catch (error) {
      throw new NotFoundException('Favori non trouvé.');
    }
  }
}
