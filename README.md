# Install

```sh
pnpm install
```

# Structure

```sh
├── apps
├── libs
└── workspaces
    ├── api-gateway
    └── webgame
```

- apps: contains micro apps of microfrontend
- libs: contains library packages for app/workspace
- workspaces
  - api-gateway: api gateway for project
  - webgame: main app to contains all games

# Useful commands

- remove all folders includes nested folders inside monorepo

```sh
pnpm -r exec -- rm -rf <folder name>
```
