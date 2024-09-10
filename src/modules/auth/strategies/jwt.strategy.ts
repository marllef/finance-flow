import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configs: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configs.get('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string; sub: number }) {
    
    const user = await this.usersService.findOne({
      email: payload.email,
    });

    if(user) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
