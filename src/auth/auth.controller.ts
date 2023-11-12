import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('singup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.creatUser(createUserDto);
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.loginUser(loginUserDto, res);
    // res.cookie('token', response.data, {
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 3600000),
    // });
    return response;
  }
}
