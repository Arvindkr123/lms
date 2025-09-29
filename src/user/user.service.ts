import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from 'src/auth/dto/register-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginUserDTO } from 'src/auth/dto/login-user.dto';
import bcrypt from 'bcrypt';
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

  async loginUser(loginUserDto: LoginUserDTO) {
    try {
      const existUser = await this.userModel.findOne({
        email: loginUserDto.email,
      });
      if (!existUser) {
        throw new BadRequestException('Invalid Credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        existUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        message: 'Login successful',
        user: {
          id: existUser._id,
          fname: existUser.fname,
          lname: existUser.lname,
          email: existUser.email,
        },
      };
    } catch (error: any) {
      // Re-throw other errors as internal server error
      throw new InternalServerErrorException(error.message || 'Login failed');
    }
  }

  async getUserByIdUser(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
    };
  }

  async deleteUserById(id: string) {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }

      return {
        message: 'User deleted successfully',
        user: {
          id: deletedUser._id,
          fname: deletedUser.fname,
          lname: deletedUser.lname,
          email: deletedUser.email,
        },
      };
    } catch (error: any) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong while deleting user',
      );
    }
  }
}
