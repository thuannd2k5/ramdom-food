import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ default: '' })
  icon: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  sortOrder: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

