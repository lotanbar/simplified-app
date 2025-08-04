import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createDto: CreateUserDto): Promise<UserDocument>;
    update(id: string, updateDto: UpdateUserDto): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findAll(): Promise<UserDocument[]>;
    findById(id: string): Promise<UserDocument>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<UserDocument>;
    updatePassword(userId: string, newPassword: string): Promise<UserDocument>;
    private checkEmailExists;
}
