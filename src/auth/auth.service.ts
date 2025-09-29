import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import bcrypt from 'bcrypt';

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
}
