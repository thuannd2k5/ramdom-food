import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { FoodsService } from './foods.service';
import { Food } from './schemas/food.schema';
import { Types } from 'mongoose';

describe('FoodsService', () => {
  let service: FoodsService;
  let mockFoodModel: any;

  const mockFoodItem = {
    _id: new Types.ObjectId('671234567890123456789012'),
    name: 'Cơm tấm sườn bì chả',
    slug: 'com-tam-suon-bi-cha',
    description: 'Thơm ngon chắc bụng',
    imageUrl: 'https://images.unsplash.com/photo-1',
    priceMin: 35000,
    priceMax: 50000,
    mealTypes: ['lunch', 'dinner'],
    tags: ['office_favorite', 'dry'],
  };

  beforeEach(async () => {
    mockFoodModel = {
      aggregate: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodsService,
        {
          provide: getModelToken(Food.name),
          useValue: mockFoodModel,
        },
      ],
    }).compile();

    service = module.get<FoodsService>(FoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomFood', () => {
    it('should return a random food matching filters', async () => {
      mockFoodModel.aggregate.mockResolvedValue([mockFoodItem]);

      const result = await service.getRandomFood({
        mealType: 'lunch',
        maxPrice: 50000,
      });

      expect(result).toBeDefined();
      expect(result.name).toBe('Cơm tấm sườn bì chả');
      expect(mockFoodModel.aggregate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no food matches filter', async () => {
      mockFoodModel.aggregate.mockResolvedValue([]);

      await expect(
        service.getRandomFood({ mealType: 'snack', maxPrice: 15000 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should exclude specified IDs if excludeIds are provided', async () => {
      mockFoodModel.aggregate.mockResolvedValue([mockFoodItem]);
      const excludeId = '671234567890123456789099';

      await service.getRandomFood({ excludeIds: excludeId });

      const calledPipeline = mockFoodModel.aggregate.mock.calls[0][0];
      const matchStage = calledPipeline.find((stage: any) => stage.$match)?.$match;
      expect(matchStage._id.$nin).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return food by id', async () => {
      mockFoodModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockFoodItem),
        }),
      });

      const result = await service.findById('671234567890123456789012');
      expect(result.name).toBe('Cơm tấm sườn bì chả');
    });

    it('should throw NotFoundException if food not found', async () => {
      mockFoodModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(
        service.findById('671234567890123456789099'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
