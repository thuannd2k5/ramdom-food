import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type FoodDocument = Food & Document;

@Schema({ timestamps: true })
export class Food {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], default: ['lunch', 'dinner'] })
  mealTypes: string[];

  @Prop({ required: true, default: 35000 })
  priceMin: number;

  @Prop({ required: true, default: 50000 })
  priceMax: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isPopular: boolean;
}

export const FoodSchema = SchemaFactory.createForClass(Food);
FoodSchema.index({ mealTypes: 1, priceMax: 1 });
FoodSchema.index({ tags: 1 });
FoodSchema.index({ categoryId: 1 });
FoodSchema.index({ name: 'text', description: 'text' });
