import { Module } from '@nestjs/common';
import { mikro } from '@automapper/mikro';
import { RouterModule } from '@nestjs/core';
import { classes } from '@automapper/classes';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AutomapperModule } from '@automapper/nestjs';

import type { Routes } from '@nestjs/core';

import { AuthModule, authRoutes } from 'api/auth/auth.module';

import { AppController } from './app.controller';

const routes: Routes = [authRoutes];

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    AutomapperModule.forRoot([
      {
        name: 'default',
        strategyInitializer: mikro(),
      },
      {
        name: 'classes',
        strategyInitializer: classes(),
      },
    ]),
    RouterModule.register(routes),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
