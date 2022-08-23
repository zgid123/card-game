import { Migration } from '@mikro-orm/migrations';

export class Migration20220823093107 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "display_name" varchar(255) null, "email" varchar(255) null, "role" text check ("role" in (\'user\', \'admin\')) not null);',
    );
    this.addSql(
      'alter table "users" add constraint "users_username_unique" unique ("username");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
