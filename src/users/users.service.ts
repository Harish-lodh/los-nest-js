// users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

function sanitize(u: UserDocument | (User & { _id: any })) {
  const { password, __v, ...rest } = (u as any).toObject ? (u as any).toObject() : u;
  return rest;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly usersModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const exists = await this.usersModel.exists({ email: dto.email.toLowerCase() });
    if (exists) throw new ConflictException('Email already in use');

    const created = await this.usersModel.create({
      full_name: dto.full_name,
      email: dto.email.toLowerCase(),
      password: dto.password,   // ⚠️ stored as plain text
      role: dto.role ?? 'user',
    });

    return sanitize(created);
  }

  async findAll() {
    const users = await this.usersModel.find().lean();
    return users.map(u => sanitize(u as any));
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('User not found');
    const user = await this.usersModel.findById(id).lean();
    if (!user) throw new NotFoundException('User not found');
    return sanitize(user as any);
  }

  async findByEmail(email: string) {
    return this.usersModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, dto: UpdateUserDto) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('User not found');

    const update: any = {};
    if (dto.full_name !== undefined) update.full_name = dto.full_name;
    if (dto.email !== undefined) update.email = dto.email.toLowerCase();
    if (dto.role !== undefined) update.role = dto.role;
    if (dto.password !== undefined) update.password = dto.password;

    const saved = await this.usersModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .lean();

    if (!saved) throw new NotFoundException('User not found');
    return sanitize(saved as any);
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('User not found');
    const res = await this.usersModel.findByIdAndDelete(id).lean();
    if (!res) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
