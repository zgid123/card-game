import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthException } from 'exceptions/entityExceptions/exceptions/AuthException';

import type { User } from 'db/models/User';

import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  public async validate(username: string, password: string): Promise<User> {
    const user = await this.authService.create({ username, password });

    if (!user) {
      throw new AuthException('unauthorized');
    }

    return user;
  }
}
