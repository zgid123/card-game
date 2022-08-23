import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';

import type { EntityRepository } from '@mikro-orm/core';

import { User } from 'db/models/User';

import type { AuthVM } from './auth.vm';
import type { IAuthParams } from './interface';

interface IGetParams {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  public async create({ username, password }: IAuthParams): Promise<User> {
    const user = await this.userRepository.findOne({
      username,
    });

    if (!user) {
      return null;
    }

    if (!compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  public login(user: User): AuthVM {
    const { username, role } = user;

    return {
      profile: user,
      authToken: this.jwtService.sign(
        {
          role,
          username,
        },
        {
          secret: process.env.JWT_SECRET,
        },
      ),
    };
  }

  public get({ username }: IGetParams): Promise<User> {
    return this.userRepository.findOneOrFail({
      username,
    });
  }
}
