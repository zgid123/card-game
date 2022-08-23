import * as React from 'react';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import type { ReactNode, FC } from 'react';
import type { Theme } from '@chakra-ui/react';

import { Fonts, theme } from './chakraTheme';

interface IThemeProviderProps {
  fontComponent?: FC;
  children: ReactNode;
  theme?: Partial<Theme>;
}

export function ThemeProvider({
  children,
  fontComponent,
  theme: themeProps = {} as Theme,
}: IThemeProviderProps): JSX.Element {
  const FontComponent = fontComponent || Fonts;
  const themeConfig = extendTheme(theme, themeProps);

  return (
    <ChakraProvider theme={themeConfig}>
      <FontComponent />
      {children}
    </ChakraProvider>
  );
}
