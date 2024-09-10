import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from '../users/dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validate(email: string, password: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) return null;

    const storedPassword = user.password;
    const isMatchPassword = await bcrypt.compare(password, storedPassword);

    if (!isMatchPassword) return null;

    const { password: _, ...result } = user;

    return result;
  }

  async login(user: UserDTO) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: SignUpDTO) {
    const { password, ...result } = await this.usersService.create(data);

    return result;
  }
}
