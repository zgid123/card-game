import { AutoMap } from '@automapper/classes';
import { Entity, Enum, Property } from '@mikro-orm/core';

import { Base } from './Base';

export const roles = {
  user: 'user',
  admin: 'admin',
} as const;

@Entity()
export class User extends Base {
  @AutoMap()
  @Property({
    unique: true,
  })
  username: string;

  @Property({
    hidden: true,
  })
  password: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  firstName?: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  lastName?: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  displayName?: string;

  @AutoMap()
  @Property({
    nullable: true,
  })
  email?: string;

  @AutoMap()
  @Enum({
    items: () => roles,
  })
  role: keyof typeof roles;
}
