import * as React from 'react';

import { Global } from '@emotion/react';
import { extendTheme } from '@chakra-ui/react';

export function Fonts(): JSX.Element {
  return (
    <Global
      styles={`
        @font-face {
          font-family: 'monoS-bold';
          src: url('/fonts/iAWriterMonoS-Bold.woff2') format('woff2');
        }
        @font-face {
          font-family: 'monoS-boldItalic';
          src: url('/fonts/iAWriterMonoS-BoldItalic.woff2') format('woff2');
        }
        @font-face {
          font-family: 'monoS-italic';
          src: url('/fonts/iAWriterMonoS-Italic.woff2') format('woff2');
        }
        @font-face {
          font-family: 'monoS-regular';
          src: url('/fonts/iAWriterMonoS-Regular.woff2') format('woff2');
        }
      `}
    />
  );
}

export const theme: ReturnType<typeof extendTheme> = extendTheme({
  fonts: {
    body: 'monoS-regular',
    heading: 'monoS-bold',
  },
});
