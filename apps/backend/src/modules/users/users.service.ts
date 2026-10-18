import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Favorite, FavoriteDocument } from './schemas/favorite.schema';
import { Food, FoodDocument } from '../foods/schemas/food.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Favorite.name)
    private readonly favoriteModel: Model<FavoriteDocument>,
    @InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>,
  ) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string | Types.ObjectId): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Thêm hoặc bỏ món ăn khỏi danh sách yêu thích
   */
  async toggleFavorite(userId: string | Types.ObjectId, foodId: string) {
    if (!Types.ObjectId.isValid(foodId)) {
      throw new NotFoundException('ID món ăn không hợp lệ');
    }

    const food = await this.foodModel.findById(foodId).exec();
    if (!food) {
      throw new NotFoundException('Món ăn không tồn tại');
    }

    const userObjId = new Types.ObjectId(userId.toString());
    const foodObjId = new Types.ObjectId(foodId);

    const existing = await this.favoriteModel.findOne({
      userId: userObjId,
      foodId: foodObjId,
    });

    if (existing) {
      await this.favoriteModel.deleteOne({ _id: existing._id });
      return {
        foodId,
        isFavorited: false,
        message: 'Đã bỏ khỏi danh sách yêu thích',
      };
    } else {
      await this.favoriteModel.create({
        userId: userObjId,
        foodId: foodObjId,
      });
      return {
        foodId,
        isFavorited: true,
        message: 'Đã lưu vào danh sách yêu thích thành công!',
      };
    }
  }

  /**
   * Lấy danh sách các món ăn đã yêu thích của người dùng
   */
  async getFavorites(userId: string | Types.ObjectId) {
    const userObjId = new Types.ObjectId(userId.toString());
    const favorites = await this.favoriteModel
      .find({ userId: userObjId })
      .populate({
        path: 'foodId',
        populate: { path: 'categoryId', select: 'name slug icon' },
      })
      .sort({ createdAt: -1 })
      .exec();

    // Lọc bỏ các favorite mà món ăn đã bị xóa
    return favorites
      .filter((fav) => fav.foodId !== null)
      .map((fav) => fav.foodId);
  }
}
