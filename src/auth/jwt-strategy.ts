import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //   constructor() {
  //     super({
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       ignoreExpiration: false,
  //       secretOrKey: process.env.SECRET_KEY,
  //     });
  //   }

  //   async validate(payload: any) {
  //     return { userId: payload.sub, username: payload.username };
  //   }

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  private static extractJWT(req: Request): string | null {
    try {
      const authenticationCookie = req.headers.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(process.env.TOKEN_KEY));

      const token = authenticationCookie?.split('=')[1];
      if (token) {
        return token;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async validate(payload: any) {
    return { payload };
  }
}
