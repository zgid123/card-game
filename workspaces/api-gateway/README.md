# Setup

```sh
  cp .env.example .env

  pnpm db:migrate
```

# Useful commands

- Create mikro-orm migration

  ```sh
    pnpm migrate:create
  ```

- Migrate mikro-orm migration

  ```sh
    pnpm db:migrate
  ```

- Create seed file

  ```sh
    pnpm seed:create <file name>
  ```

- Run seed data

  ```sh
    pnpm db:seed --class=<seeder class name>
  ```

# Exception code

`10_000~19_999`: common exceptions

`X1_000~X1_999`: mikro exceptions

`X2_000~X2_999`: class validator exceptions

# Unit test

Unit test for controller is e2e testing.

Make sure you already created database for testing. And always create real record for testing, don't mock if unnecessary.

Max workers for jest currently is 1. Because we need to clean database before running next test file. We will remove this one once we find a solution to clean database without setting it by 1.

## Setup unit test

```sh
  cp .env.test.local.example .env.test.local

  pnpm db-test:migrate
```
