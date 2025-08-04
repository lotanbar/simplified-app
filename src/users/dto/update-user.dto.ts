import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType is a nestjs util that makes all props optional
export class UpdateUserDto extends PartialType(CreateUserDto) {}