import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async registerUser(registerUserDto: RegisterUserDTO) {
    const hassPassword = await bcrypt.hash(registerUserDto.password, 10);
    return await this.userService.createUser({
      ...registerUserDto,
      password: hassPassword,
    });
  }

  async loginUser(loginUserDto: LoginUserDTO) {
    return await this.userService.loginUser(loginUserDto);
  }

  async getUserByIdUser(_id: string) {
    return await this.userService.getUserByIdUser(_id);
  }

  async deleteUserById(_id: string) {
    return await this.userService.deleteUserById(_id);
  }
  async updateUserById(data: RegisterUserDTO, _id: string) {
    return await this.userService.updateUserById(data, _id);
  }
}
