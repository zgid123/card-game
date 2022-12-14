import { resolve } from 'path';
import { readdirSync } from 'fs';
import detect from 'detect-port';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vite';
import federation from '@originjs/vite-plugin-federation';

import pkg from './package.json';

export default async function config(): Promise<UserConfigExport> {
  const port = await detect(3000);

  const items = readdirSync(resolve(__dirname, 'src'));

  return defineConfig({
    server: {
      port,
    },
    optimizeDeps: {
      exclude: ['cryptocurrency'],
    },
    plugins: [
      react(),
      federation({
        remotes: {
          cryptocurrency: 'http://localhost:8000/assets/remoteEntry.js',
        },
        shared: {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: pkg.dependencies.react,
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: pkg.dependencies['react-dom'],
          },
          'react-router-dom': {
            eager: true,
            singleton: true,
            requiredVersion: pkg.dependencies['react-router-dom'],
          },
          '@chakra-ui/react': {
            eager: true,
            singleton: true,
            requiredVersion: pkg.dependencies['@chakra-ui/react'],
          },
        },
      }),
    ],
    resolve: {
      alias: items.map((item) => {
        if (/\.(t|j)sx?$/.test(item)) {
          const name = item.replace(/\.(t|j)sx?$/, '');

          return {
            find: name,
            replacement: `/src/${name}`,
          };
        } else {
          return {
            find: item,
            replacement: `/src/${item}`,
          };
        }
      }),
    },
    build: {
      target: 'esnext',
    },
  });
}
