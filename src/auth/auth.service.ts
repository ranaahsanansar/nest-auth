import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  //   Http Functions -------------------
  async creatUser(
    creatUserDto: CreateUserDto,
  ): Promise<{ message: string; data: any }> {
    try {
      const saltOrRounds = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(
        creatUserDto.password,
        saltOrRounds,
      );

      //   check user
      const checkEmail: UserEntity = await this.userEntity.findOne({
        where: { email: creatUserDto.email },
      });
      if (checkEmail?.email === creatUserDto.email) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      const checkUserName: UserEntity = await this.userEntity.findOne({
        where: { userName: creatUserDto.userName },
      });
      if (checkUserName?.userName === creatUserDto.userName) {
        throw new HttpException(
          'User name already exists',
          HttpStatus.CONFLICT,
        );
      }

      await this.userEntity.save({
        ...creatUserDto,
        password: passwordHash,
      });
      return { message: 'User Created Successfully', data: null };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }

  async loginUser(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<{ message: string; data: string }> {
    try {
      let user: UserEntity = null;
      if (loginUserDto?.email) {
        user = await this.userEntity.findOne({
          where: { email: loginUserDto.email },
        });
      } else if (loginUserDto?.userName) {
        user = await this.userEntity.findOne({
          where: { userName: loginUserDto.userName },
        });
      } else {
        throw new HttpException(
          'Username or Email at least one value required',
          HttpStatus.BAD_REQUEST,
        );
      }
      //   check User password Match
      const isMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (isMatch) {
        let payload = {
          id: user.id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        };
        const token: string = await this.jwtService.signAsync(payload);
        res.cookie('token', token, {
          httpOnly: true,
          expires: new Date(Date.now() + 3600000),
        });
        return { message: 'Login successful', data: null };
      } else {
        throw new HttpException('Wrong Password', HttpStatus.FORBIDDEN);
      }
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error.message, error.status);
    }
  }
}
