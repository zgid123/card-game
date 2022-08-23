import * as React from 'react';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@libs/rc-components';
import {
  QueryClient,
  ReactQueryDevtools,
  QueryClientProvider,
} from '@libs/rc-utils/queryHooks';

import { App } from 'App';
import { theme } from 'config/chakraTheme';
import { AuthProvider } from 'contexts/AuthContext';

const queryClient = new QueryClient();

const container = document.getElementById('root');

if (!container) {
  // eslint-disable-next-line no-throw-literal
  throw 'Cannot find the root element';
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
