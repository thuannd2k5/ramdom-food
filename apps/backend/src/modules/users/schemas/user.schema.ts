import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ default: null })
  passwordHash?: string;

  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ default: null })
  avatarUrl?: string;

  @Prop({ default: 'local' })
  authProvider: string; // 'local' | 'google'

  @Prop({ default: null })
  googleId?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ googleId: 1 }, { sparse: true });
