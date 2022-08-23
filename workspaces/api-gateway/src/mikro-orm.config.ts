import { MikroORMOptions } from '@mikro-orm/core';

import { MikroNamingStrategy } from './config/mikro';

const config: Partial<MikroORMOptions> = {
  type: 'postgresql',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  entities: ['./dist/db/models'],
  entitiesTs: ['./src/db/models'],
  password: process.env.DB_PASSWORD,
  namingStrategy: MikroNamingStrategy,
  port: parseInt(process.env.DB_PORT, 10),
  debug: process.env.NODE_ENV === 'development',
  dbName: process.env.DB_NAME || 'ecommerce_development',
  seeder: {
    glob: '!(*.d).{js,ts}',
    path: './dist/db/seeds',
    pathTs: './src/db/seeds',
  },
  migrations: {
    path: './dist/db/migrations',
    pathTs: './src/db/migrations',
  },
};

export default config;
