import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Food, FoodDocument } from './schemas/food.schema';
import { GetRandomFoodDto } from './dto/get-random-food.dto';
import { GetFoodsFilterDto } from './dto/get-foods-filter.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>,
  ) {}

  /**
   * Lấy 1 món ăn ngẫu nhiên dựa trên bộ lọc
   */
  async getRandomFood(dto: GetRandomFoodDto): Promise<any> {
    const matchFilter: Record<string, any> = {};

    if (dto.mealType) {
      matchFilter.mealTypes = dto.mealType;
    }

    if (dto.maxPrice) {
      matchFilter.priceMin = { $lte: dto.maxPrice };
    }

    if (dto.tag) {
      matchFilter.tags = dto.tag;
    }

    if (dto.categoryId && Types.ObjectId.isValid(dto.categoryId)) {
      matchFilter.categoryId = new Types.ObjectId(dto.categoryId);
    }

    if (dto.excludeIds) {
      const idsToExclude = dto.excludeIds
        .split(',')
        .map((id) => id.trim())
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      if (idsToExclude.length > 0) {
        matchFilter._id = { $nin: idsToExclude };
      }
    }

    const pipeline: any[] = [
      { $match: matchFilter },
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const results = await this.foodModel.aggregate(pipeline);

    if (!results || results.length === 0) {
      throw new NotFoundException(
        'Không tìm thấy món ăn phù hợp với bộ lọc hiện tại. Hãy thử nới rộng khoảng giá hoặc chọn bữa ăn khác nhé!',
      );
    }

    return results[0];
  }

  /**
   * Lấy danh sách tất cả món ăn có phân trang và tìm kiếm
   */
  async findAll(dto: GetFoodsFilterDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (dto.keyword) {
      query.$or = [
        { name: { $regex: dto.keyword, $options: 'i' } },
        { description: { $regex: dto.keyword, $options: 'i' } },
      ];
    }

    if (dto.categoryId && Types.ObjectId.isValid(dto.categoryId)) {
      query.categoryId = new Types.ObjectId(dto.categoryId);
    }

    if (dto.mealType) {
      query.mealTypes = dto.mealType;
    }

    const [foods, total] = await Promise.all([
      this.foodModel
        .find(query)
        .populate('categoryId', 'name slug icon')
        .skip(skip)
        .limit(limit)
        .sort({ isPopular: -1, createdAt: -1 })
        .exec(),
      this.foodModel.countDocuments(query).exec(),
    ]);

    return {
      items: foods,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Xem chi tiết món ăn theo ID
   */
  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID món ăn không hợp lệ');
    }

    const food = await this.foodModel
      .findById(id)
      .populate('categoryId', 'name slug icon')
      .exec();

    if (!food) {
      throw new NotFoundException('Món ăn không tồn tại');
    }

    return food;
  }
}
