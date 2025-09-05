import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('RoleService', () => {
  let service: RoleService;
  let prisma: PrismaService;

  const mockPrisma = {
    role: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should return created role', async () => {
      const dto = { name: 'Admin' };
      const created = { id: '1', name: 'Admin' };
      mockPrisma.role.create.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(result).toEqual({
        data: created,
        message: 'Rôle créé avec succès',
      });
    });

    it('should throw BadRequestException on duplicate', async () => {
      mockPrisma.role.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create({ name: 'Admin' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.role.create.mockRejectedValue(new Error('Unknown'));

      await expect(service.create({ name: 'Admin' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return roles and total count', async () => {
      const roles = [{ id: '1', name: 'Admin' }];
      mockPrisma.role.findMany.mockResolvedValue(roles);
      mockPrisma.role.count.mockResolvedValue(1);

      const result = await service.findAll();
      expect(result).toEqual({
        data: roles,
        total: 1,
        message: 'Rôles récupérés avec succès',
      });
    });

    it('should throw NotFoundException if no roles', async () => {
      mockPrisma.role.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return one role', async () => {
      const role = { id: '1', name: 'Admin' };
      mockPrisma.role.findUnique.mockResolvedValue(role);

      const result = await service.findOne('1');
      expect(result).toEqual({
        data: role,
        message: 'Rôle récupéré avec succès',
      });
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated role', async () => {
      const updated = { id: '1', name: 'Super Admin' };
      mockPrisma.role.update.mockResolvedValue(updated);

      const result = await service.update('1', { name: 'Super Admin' });
      expect(result).toEqual({
        data: updated,
        message: 'Rôle mis à jour avec succès',
      });
    });

    it('should throw BadRequestException on duplicate update', async () => {
      mockPrisma.role.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('1', { name: 'Admin' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.role.update.mockRejectedValue(new Error('Unknown'));

      await expect(service.update('1', { name: 'Admin' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should delete and return message', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: '1', name: 'Admin' });
      mockPrisma.role.delete.mockResolvedValue(undefined);

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Rôle supprimé avec succès' });
    });

    it('should throw NotFoundException if role does not exist', async () => {
      mockPrisma.role.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException on foreign key constraint', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: '1', name: 'Admin' });
      mockPrisma.role.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.remove('1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.role.findUnique.mockResolvedValue({ id: '1', name: 'Admin' });
      mockPrisma.role.delete.mockRejectedValue(new Error('Unknown'));

      await expect(service.remove('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
