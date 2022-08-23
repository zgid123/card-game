import { Seeder } from '@mikro-orm/seeder';

import type { EntityManager } from '@mikro-orm/core';

import { User } from '../models/User';
import { bcryptHash } from '../../utils/hash';

export class CreateUsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const repo = em.getRepository(User);
    const username = process.env.ADMIN_USERNAME;

    const admin = await repo.findOne({
      username,
    });

    if (!admin) {
      const { hash } = await bcryptHash({
        source: process.env.ADMIN_PASSWORD,
      });

      repo.create({
        username,
        role: 'admin',
        password: hash,
      });
    }
  }
}
