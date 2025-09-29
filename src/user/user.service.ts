import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserDTO } from 'src/auth/dto/register-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async createUser(registerUserDto: RegisterUserDTO) {
    try {
      const createdUser = new this.userModel(registerUserDto);
      await createdUser.save();
      return {
        message: 'User created successfully!',
        user: createdUser,
      };
    } catch (error: any) {
      if (error instanceof Error && (error as any).code === 11000) {
        throw new BadRequestException('Email already exists');
      }

      if (error instanceof Error && (error as any).name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
