import * as detect from 'detect-port';

import { config } from 'dotenv';
import { NestFactory, Reflector } from '@nestjs/core';
import { ExceptionFilter, ResponseInterceptor } from '@libs/nc-interceptors';

import type { LogLevel } from '@nestjs/common';

config({
  path: '.env',
});

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production.local'
      : '.env.local',
});

import { AppModule } from 'app.module';
import { JwtAuthGuard, RolesGuard } from 'commons/guard';

async function bootstrap() {
  let logLevels: LogLevel[] = ['error', 'log', 'warn'];

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    logLevels = ['error', 'warn', 'log', 'verbose', 'debug'];
  }

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.enableCors();
  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new ExceptionFilter());

  const port = await detect(3000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Run on ${port}`);
}

bootstrap();
