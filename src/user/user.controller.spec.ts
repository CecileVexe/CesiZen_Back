/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserwithClerkDTo } from './dto/create-user.dto';
import {
  UpdateUserCredentialsDto,
  UpdateUserDto,
  UpdateUserRoleDto,
} from './dto/update-user.dto';
import { UserType } from 'src/utils/types/PrismaApiModel.type';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockUser: UserType = {
    id: 'UserId',
    email: 'test@example.com',
    name: 'John',
    surname: 'Doe',
    role: {
      id: 'roleId',
      name: 'User',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            createWithClerk: jest.fn(),
            findAll: jest.fn(),
            findOneFromClerk: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            updateRole: jest.fn(),
            updateCredentials: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
        clerkId: 'clerkId',
        password: 'password',
        roleId: 'userId',
      };

      service.create.mockResolvedValue({
        data: mockUser,
        message: 'OK',
      });

      const result = await controller.create(dto);
      expect(result).toEqual({ data: mockUser, message: 'OK' });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('createWithClerk', () => {
    it('should call service.createWithClerk', async () => {
      const dto: CreateUserwithClerkDTo = {
        clerkId: 'clerk-123',
      };

      service.createWithClerk.mockResolvedValue({
        data: mockUser,
        message: 'OK',
      });

      const result = await controller.createWithClerk(dto);
      expect(result).toEqual({ data: mockUser, message: 'OK' });
      expect(service.createWithClerk).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with pagination and sorting', async () => {
      const mockUserReturn = mockUser;
      service.findAll.mockResolvedValue({
        data: [mockUserReturn],
        message: 'OK',
        page: 1,
        pageSize: 10,
        total: 1,
      });

      const result = await controller.findAll('1', '10', 'email', 'desc');
      expect(result).toEqual({
        data: [mockUser],
        message: 'OK',
        total: 1,
        page: 1,
        pageSize: 10,
      });
      expect(service.findAll).toHaveBeenCalledWith(1, 10, 'email', 'desc');
    });
  });

  describe('findOneFromClerk', () => {
    it('should call service.findOneFromClerk', async () => {
      service.findOneFromClerk.mockResolvedValue({
        data: mockUser,
        message: 'OK',
      });

      const result = await controller.findOneFromClerk('clerk-123');
      expect(result).toEqual({ data: mockUser, message: 'OK' });
      expect(service.findOneFromClerk).toHaveBeenCalledWith('clerk-123');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', async () => {
      service.findOne.mockResolvedValue({
        data: mockUser,
        message: 'OK',
      });

      const result = await controller.findOne('1');
      expect(result).toEqual({ data: mockUser, message: 'OK' });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('updateCredentials', () => {
    it('should call service.updateCredentials', async () => {
      const dto: UpdateUserCredentialsDto = {
        email: 'new@example.com',
        password: 'newpassword',
        oldPassword: 'oldPassword',
        clerkId: 'ClerkId',
        name: 'John',
        surname: 'Doe',
        roleId: 'userId',
      };

      service.updateCredentials.mockResolvedValue({
        message: 'Updated',
        status: 200,
      });

      const result = await controller.updateCredentials(dto);
      expect(result).toEqual({ message: 'Updated', status: 200 });
      expect(service.updateCredentials).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateRole', () => {
    it('should call service.updateRole', async () => {
      const dto: UpdateUserRoleDto = {
        roleId: 'ADMIN',
        name: 'Joe',
        surname: 'Doe',
        email: 'exemple@email.com',
      };

      service.updateRole.mockResolvedValue({
        data: { ...mockUser, role: { id: 'AdminId', name: 'ADMIN' } },
        message: 'OK',
      });

      const result = await controller.updateRole('1', dto);
      expect(result).toEqual({
        data: { ...mockUser, role: { id: 'AdminId', name: 'ADMIN' } },
        message: 'OK',
      });
      expect(service.updateRole).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const dto: UpdateUserDto = {
        name: 'Jane',
        clerkId: 'clerkId',
        surname: 'Dae',
        email: 'exemple@email.com',
        roleId: 'UserId',
      };

      service.update.mockResolvedValue({
        data: { ...mockUser, name: 'Jane' },
        message: 'OK',
      });

      const result = await controller.update('1', dto);
      expect(result).toEqual({
        data: { ...mockUser, name: 'Jane' },
        message: 'OK',
      });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      service.remove.mockResolvedValue({ message: 'Deleted' });

      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'Deleted' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
