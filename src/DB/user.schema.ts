import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from '../common/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, minlength: 3, maxlength: 20 })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ min: 18, max: 100, default: null })
  age: number;

  @Prop({ trim: true, default: null })
  bio: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ trim: true, default: null })
  phone: string;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.CUSTOMER })
  role: RoleEnum;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: null, select: false })
  refreshTokenJti: string;

  @Prop({ default: null })
  passwordResetToken: string;

  @Prop({ default: null })
  passwordResetExpires: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
