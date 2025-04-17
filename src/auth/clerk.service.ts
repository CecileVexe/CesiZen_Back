/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  CreateUserDto,
  CreateUserwithClerkDTo,
} from 'src/user/dto/create-user.dto';
import {
  UpdateUserCredentialsDto,
  UpdateUserDto,
} from 'src/user/dto/update-user.dto';

@Injectable()
export class ClerkService {
  private readonly clerkApiUrl = 'https://api.clerk.com/v1/users';
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY;

  async createClerkUser(UserData: CreateUserDto) {
    try {
      const response = await clerkClient.users.createUser({
        firstName: UserData.name,
        lastName: UserData.surname,
        emailAddress: [UserData.email],
        password: UserData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error);
      if (error.status === 422) {
        throw new BadRequestException(
          'Une erreur est survenu, vieullez vérifier les informations transmises',
        );
      }
      throw new InternalServerErrorException(
        'Erreur lors de la création dans Clerk',
      );
    }
  }

  async updateClerkUser(clerkId: string, UserData: UpdateUserDto) {
    try {
      const response = await clerkClient.users.updateUser(clerkId, {
        firstName: UserData.name,
        lastName: UserData.surname,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour dans Clerk',
      );
    }
  }

  async updateClerkUserCredentials(
    clerkId: string,
    UserData: UpdateUserCredentialsDto,
  ) {
    try {
      const response = await clerkClient.users.updateUser(clerkId, {
        password: UserData.password,
      });
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la mise à jour dans Clerk',
      );
    }
  }

  async getClerkUser(UserData: CreateUserwithClerkDTo) {
    if (!UserData.clerkId) {
      return undefined;
    }

    try {
      const response = await clerkClient.users.getUser(UserData.clerkId);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }

  async deleteClerkUser(id: string) {
    try {
      const response = await clerkClient.users.deleteUser(id);
      return response;
    } catch (error) {
      console.error('Erreur Clerk:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        'Erreur lors de la récupération du citoyen dans Clerk',
      );
    }
  }
}
