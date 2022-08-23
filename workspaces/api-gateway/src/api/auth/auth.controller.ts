import { UseLocalMapperInterceptor } from '@libs/nc-interceptors';
import { Request, Controller, Post, UseGuards, Get } from '@nestjs/common';

import { User } from 'db/models/User';
import { LocalAuthGuard, Public } from 'commons/guard';

import { AuthService } from './auth.service';
import { AuthVM, ProfileVM } from './auth.vm';

import type { IRequestProps } from './interface';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Public()
  @UseLocalMapperInterceptor(AuthVM, AuthVM)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  public create(@Request() req: IRequestProps): AuthVM {
    return this.authService.login(req.user);
  }

  @UseLocalMapperInterceptor(User, ProfileVM)
  @Get('/profile')
  public profile(@Request() req: IRequestProps): User {
    return req.user;
  }
}
