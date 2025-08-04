import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from '../utils/bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createDto: CreateUserDto): Promise<UserDocument> {
    await this.checkEmailExists(createDto.email);
    
    const hashedPassword = await hashPassword(createDto.password);
    return this.userModel.create({
      ...createDto,
      password: hashedPassword,
    });
  }

  async update(id: string, updateDto: UpdateUserDto): Promise<UserDocument> {
    const updatePayload: any = { ...updateDto };
    
    if (updateDto.password) {
      updatePayload.password = await hashPassword(updateDto.password);
    }

    const user = await this.userModel.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<UserDocument> {
    const user = await this.findById(userId);
    user.refreshToken = refreshToken;
    return user.save();
  }

  async updatePassword(userId: string, newPassword: string): Promise<UserDocument> {
    const hashedPassword = await hashPassword(newPassword);
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async checkEmailExists(email: string): Promise<void> {
    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new BadRequestException('User with this email already exists');
    }
  }
}