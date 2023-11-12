import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  async tokenDecode(token: string) {
    // console.log('Token Decode');
    try {
      return await jwtDecode(token);
    } catch (error) {
      this.logger.error('Error in tokenDecode', error.message);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      // check if the token is present in the request header

      // if (!request.headers.authorization)
      //   throw new UnauthorizedException('Token not Provided');

      // const token = request.headers.authorization.replace('Bearer ', '');

      //   console.log(request.headers.authorization);

      const authenticationCookie = request.headers.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(process.env.TOKEN_KEY));

      const token = authenticationCookie?.split('=')[1];

      console.log('Token in gurad', token);

      if (!token) {
        throw new UnauthorizedException('Token not Provided');
      }
      // Checking JWT Expiration
      const result = (await super.canActivate(context)) as boolean;
      // console.log(result);

      const user = await this.tokenDecode(token);
      request.user = user;
      // console.log('user', user);
      return result;
    } catch (e) {
      this.logger.error('Error : ', e);
      throw new HttpException(e.message, e.status);
    }
  }
}
