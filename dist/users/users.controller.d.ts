import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<import("./user.schema").UserDocument[]>;
    getUser(id: string): Promise<import("./user.schema").UserDocument>;
    create(createUserDto: CreateUserDto): Promise<import("./user.schema").UserDocument>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("./user.schema").UserDocument>;
}
