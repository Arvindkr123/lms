import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDTO) {
    const message = this.authService.registerUser(registerUserDto);
    return message;
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDTO) {
    const message = this.authService.loginUser(loginUserDto);
    return message;
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const message = await this.authService.getUserByIdUser(id);
    return message;
  }

  @Delete('users/:id')
  async deleteUserById(@Param('id') id: string) {
    return await this.authService.deleteUserById(id);
  }
}
