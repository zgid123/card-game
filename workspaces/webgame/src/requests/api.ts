import { Api } from '@libs/es-core-utils/api';

Api.config({
  skipVersion: true,
  storage: localStorage,
  baseUrl: import.meta.env.VITE_API_ENDPOINT,
});

export const api = Api;
