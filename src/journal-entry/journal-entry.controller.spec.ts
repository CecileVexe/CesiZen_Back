/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JournalEntryController } from './journal-entry.controller';
import { JournalEntryService } from './journal-entry.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';
import { JournalEntryType } from 'src/utils/types/PrismaApiModel.type';

describe('JournalEntryController', () => {
  let controller: JournalEntryController;
  let service: JournalEntryService;

  const mockEntry: JournalEntryType = {
    id: 'entry1',
    date: new Date(),
    description: 'Il a fait beau !',
    emotionId: 'emotion1',
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue({ data: mockEntry, message: 'Créé' }),
    findAllFromUserByJournal: jest
      .fn()
      .mockResolvedValue({ data: [mockEntry], message: 'Liste récupérée' }),
    findOneFromUserByJournalByDate: jest
      .fn()
      .mockResolvedValue({ data: mockEntry, message: 'Trouvé par date' }),
    findOneFromUserByJournal: jest
      .fn()
      .mockResolvedValue({ data: mockEntry, message: 'Entrée trouvée' }),
    updateFromUser: jest
      .fn()
      .mockResolvedValue({ data: mockEntry, message: 'Mise à jour' }),
    removeFromUser: jest.fn().mockResolvedValue({ message: 'Supprimé' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalEntryController],
      providers: [
        {
          provide: JournalEntryService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<JournalEntryController>(JournalEntryController);
    service = module.get<JournalEntryService>(JournalEntryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateJournalEntryDto = {
        description: 'Il a fait beau !',
        emotionId: 'emotion1',
        userId: 'user1',
      };

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ data: mockEntry, message: 'Créé' });
    });
  });

  describe('findAll', () => {
    it('should return all entries of a user for a journal', async () => {
      const result = await controller.findAll('journal1', 'user1');
      expect(service.findAllFromUserByJournal).toHaveBeenCalledWith(
        'user1',
        'journal1',
      );
      expect(result).toEqual({ data: [mockEntry], message: 'Liste récupérée' });
    });
  });

  describe('findOneByDate', () => {
    it('should return entry for a given date and user', async () => {
      const result = await controller.findOneByDate('2024-05-01', 'user1');
      expect(service.findOneFromUserByJournalByDate).toHaveBeenCalledWith(
        'user1',
        '2024-05-01',
      );
      expect(result).toEqual({ data: mockEntry, message: 'Trouvé par date' });
    });
  });

  describe('findOne', () => {
    it('should return entry by id for user', async () => {
      const result = await controller.findOne('entry1', 'user1');
      expect(service.findOneFromUserByJournal).toHaveBeenCalledWith(
        'user1',
        'entry1',
      );
      expect(result).toEqual({ data: mockEntry, message: 'Entrée trouvée' });
    });
  });

  describe('update', () => {
    it('should update entry by id', async () => {
      const dto: UpdateJournalEntryDto = {
        description: 'Mis à jour',
        emotionId: 'joy',
      };

      const result = await controller.update('entry1', dto);
      expect(service.updateFromUser).toHaveBeenCalledWith('entry1', dto);
      expect(result).toEqual({ data: mockEntry, message: 'Mise à jour' });
    });
  });

  describe('remove', () => {
    it('should remove entry by id and userId', async () => {
      const result = await controller.remove('entry1', 'user1');
      expect(service.removeFromUser).toHaveBeenCalledWith('user1', 'entry1');
      expect(result).toEqual({ message: 'Supprimé' });
    });
  });
});
