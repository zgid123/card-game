import type { User } from 'db/models/User';

export interface IAuthParams {
  username: string;
  password: string;
}

export interface IAuthVMProps {
  profile: User;
  authToken: string;
}

export interface IRequestProps {
  user: User;
}
