import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}
  async create(createMessageDto: CreateMessageDto) {
    try {
      const Message = await this.prisma.message.create({
        data: createMessageDto,
        select: {
          title: true,
          description: true,
          createdAt: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new InternalServerErrorException(
          `Une erreur est survenue lors de la création du Message`,
        );
      }

      return { data: Message, message: 'Message créé avec succès' };
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

  async findAll(citizenId: string | undefined) {
    try {
      const Messages = await this.prisma.message.findMany({
        where: { citizenId: citizenId },
        select: {
          title: true,
          description: true,
          createdAt: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Messages || Messages.length === 0) {
        throw new NotFoundException('Aucun Message trouvé');
      }
      const totalMessages = await this.prisma.message.count();

      return {
        data: Messages,
        total: totalMessages,
        message: 'Messages récupérés avec succès',
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
      const Message = await this.prisma.message.findUnique({
        where: { id: id },
        select: {
          title: true,
          description: true,
          createdAt: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new NotFoundException('Message non trouvé');
      }

      return { data: Message, message: 'Message récupéré avec succès' };
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

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    try {
      const Message = await this.prisma.message.update({
        data: updateMessageDto,
        where: { id: id },
        select: {
          title: true,
          description: true,
          createdAt: true,
          citizen: {
            select: {
              name: true,
              surname: true,
            },
          },
        },
      });

      if (!Message) {
        throw new NotFoundException('Message non trouvé pour la mise à jour');
      }

      return { data: Message, message: 'Message mis à jour avec succès' };
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
      const Message = await this.prisma.message.findUnique({
        where: { id: id },
      });
      if (!Message) {
        throw new NotFoundException('Message non trouvé');
      }

      await this.prisma.message.delete({ where: { id: id } });
      return { message: 'Message supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Impossible de supprimer ce Message : contrainte de dépendance',
        );
      }
      throw new InternalServerErrorException(
        'Une erreur inconnue est survenue lors de la suppression du Message',
      );
    }
  }
}
