import { AutoMap } from '@automapper/classes';

import type { User } from 'db/models/User';

export class ProfileVM {
  @AutoMap()
  username: string;

  @AutoMap()
  firstName?: string;

  @AutoMap()
  lastName?: string;

  @AutoMap()
  email: string;

  @AutoMap()
  displayName: string;
}

export class AuthVM {
  @AutoMap(() => ProfileVM)
  profile: User;

  @AutoMap()
  authToken: string;
}
