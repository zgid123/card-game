import type { IUserVMProps } from './userVM';

export interface IAuthVMProps {
  authToken: string;
  profile: IUserVMProps;
}
