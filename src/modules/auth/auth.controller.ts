import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/sign-up.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestUser } from '../../common/decorators/user.decorator';
import { UserDTO } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@RequestUser() user: UserDTO) {
    return await this.authService.login(user);
  }

  @Post('register')
  async register(@Body() data: SignUpDTO) {
    return await this.authService.register(data);
  }
}
