import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'ahsan@gmail.com' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'ahsan' })
  @IsOptional()
  userName?: string;

  @ApiProperty({ example: 'Ahsan@123' })
  password: string;
}
