import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../DB/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    const user = new this.userModel(data);
    return user.save() as Promise<UserDocument>;
  }

  async findOne(
    filter: Record<string, any>,
    options: { includePassword?: boolean; includeJti?: boolean } = {},
  ): Promise<UserDocument | null> {
    let query = this.userModel.findOne(filter);
    if (options.includePassword) query = query.select('+password') as any;
    if (options.includeJti) query = query.select('+refreshTokenJti') as any;
    return query.lean({ virtuals: false }).exec() as Promise<UserDocument | null>;
  }

  async findByEmail(
    email: string,
    options: { includePassword?: boolean; includeJti?: boolean } = {},
  ): Promise<UserDocument | null> {
    return this.findOne({ email: email.toLowerCase() }, options);
  }

  async findById(
    id: string,
    options: { includeJti?: boolean } = {},
  ): Promise<UserDocument | null> {
    let query = this.userModel.findById(id);
    if (options.includeJti) query = query.select('+refreshTokenJti') as any;
    return query.lean({ virtuals: false }).exec() as Promise<UserDocument | null>;
  }

  async updateById(
    id: string,
    update: Record<string, any>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean({ virtuals: false })
      .exec() as Promise<UserDocument | null>;
  }

  async exists(filter: Record<string, any>): Promise<boolean> {
    const doc = await this.userModel.exists(filter);
    return !!doc;
  }
}
