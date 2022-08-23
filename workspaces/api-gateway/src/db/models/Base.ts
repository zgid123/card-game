import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class Base {
  @AutoMap()
  @PrimaryKey()
  id: number;

  @AutoMap()
  @Property()
  createdAt: Date = new Date();

  @AutoMap()
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
