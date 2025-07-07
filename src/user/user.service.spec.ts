import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { ClerkService } from 'src/auth/clerk.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let clerkService: ClerkService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
  };

  const mockClerkService = {
    createClerkUser: jest.fn(),
    getClerkUser: jest.fn(),
    updateClerkUser: jest.fn(),
    deleteClerkUser: jest.fn(),
    updateClerkUserCredentials: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ClerkService, useValue: mockClerkService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    clerkService = module.get<ClerkService>(ClerkService);
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        roleId: '1',
        name: 'John',
        surname: 'Doe',
        password: 'password',
        clerkId: 'clerkId',
      };
      const clerkUser = {
        id: 'clerk-id',
        firstName: 'John',
        lastName: 'Doe',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      };

      mockClerkService.getClerkUser.mockResolvedValue(clerkUser);
      mockPrismaService.role.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
      });

      const result = await userService.create(createUserDto);

      expect(result).toEqual({
        data: {
          id: '1',
          email: 'test@example.com',
          name: 'John',
          surname: 'Doe',
        },
        message: 'Utilisateur créé avec succès',
      });
      expect(mockClerkService.getClerkUser).toHaveBeenCalledWith(createUserDto);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should handle Prisma error when creating a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        roleId: '1',
        name: 'John',
        surname: 'Doe',
        password: 'password',
        clerkId: 'clerkId',
      };
      const clerkUser = {
        id: 'clerk-id',
        firstName: 'John',
        lastName: 'Doe',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
      };

      mockClerkService.getClerkUser.mockResolvedValue(clerkUser);
      mockPrismaService.user.create.mockRejectedValue(new Error('Some error'));

      await expect(userService.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should successfully update a user', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        clerkId: 'clerk-id',
        name: 'John',
        surname: 'Doe',
        roleId: 'role1',
      };
      const updatedUser = {
        id: '1',
        email: 'updated@example.com',
        name: 'John',
        surname: 'Doe',
      };

      mockClerkService.updateClerkUser.mockResolvedValue(updatedUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await userService.update('1', updateUserDto);

      expect(result).toEqual({
        data: updatedUser,
        message: 'Utilisateur mis à jour avec succès',
      });
      expect(mockClerkService.updateClerkUser).toHaveBeenCalledWith(
        'clerk-id',
        updateUserDto,
      );
    });

    it('should throw an error if user to update is not found', async () => {
      const updateUserDto = {
        email: 'updated@example.com',
        clerkId: 'clerk-id',
        name: 'John',
        surname: 'Doe',
        roleId: 'role1',
      };

      mockClerkService.updateClerkUser.mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue(null);

      await expect(userService.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should successfully delete a user', async () => {
      const user = { id: '1', clerkId: 'clerk-id' };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockClerkService.deleteClerkUser.mockResolvedValue(undefined);
      mockPrismaService.user.delete.mockResolvedValue(user);

      const result = await userService.remove('1');

      expect(result).toEqual({ message: 'Utilisateur supprimé avec succès' });
      expect(mockClerkService.deleteClerkUser).toHaveBeenCalledWith('clerk-id');
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw an error if user to delete is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(userService.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
