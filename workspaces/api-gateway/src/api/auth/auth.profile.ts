import { Injectable } from '@nestjs/common';
import { createMap, forMember, ignore } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';

import type { Mapper } from '@automapper/core';

import { User } from 'db/models/User';

import { AuthVM, ProfileVM } from './auth.vm';

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, User, ProfileVM);
      createMap(
        mapper,
        AuthVM,
        AuthVM,
        forMember((destination) => destination.profile.id, ignore()),
      );
    };
  }
}
