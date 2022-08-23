import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RouteTree } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User } from 'db/models/User';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthProfile } from './auth.profile';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    PassportModule.register({}),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy, AuthProfile],
  exports: [PassportModule],
})
export class AuthModule {}

export const authRoutes: RouteTree = {
  path: 'api',
  module: AuthModule,
};
