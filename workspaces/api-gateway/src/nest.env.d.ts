declare namespace NodeJS {
  export interface ProcessEnv {
    DB_NAME: string;
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    JWT_SECRET: string;
    DB_PASSWORD: string;
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
    NODE_ENV: 'development' | 'production' | 'staging' | 'test';
  }
}
