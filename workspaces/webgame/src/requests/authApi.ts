import type { IApiRequestProps } from '@libs/es-core-utils/api';

import type { IAuthVMProps } from 'interfaces/authVM';
import type { IUserVMProps } from 'interfaces/userVM';

import { api } from './api';

interface ISignInParams {
  username: string;
  password: string;
}

const baseUrl = import.meta.env.VITE_AUTH_API_ENDPOINT;

function signIn(data: ISignInParams): Promise<IAuthVMProps> {
  return api.post<IAuthVMProps>({
    data,
    isExternal: true,
    endpoint: `${baseUrl}/sign-in`,
  });
}

function getProfile({ signal }: IApiRequestProps): Promise<IUserVMProps> {
  return api.get<IUserVMProps>({
    signal,
    isExternal: true,
    endpoint: `${baseUrl}/profile`,
  });
}

export const authApi = {
  signIn,
  getProfile,
};
