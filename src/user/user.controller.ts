import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/utils/get-user-decorator';
import { Token } from 'src/utils/user-constants';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('test')
  // @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async test(@GetUser() user: Token) {
    console.log(user);
    return 'Working';
  }
}
