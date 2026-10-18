import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import { Food, FoodSchema } from './schemas/food.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Food.name, schema: FoodSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}
