import * as React from 'react';

import { Box, forwardRef } from '@chakra-ui/react';

import type { BoxProps } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFormProps extends BoxProps {}

export const Form = forwardRef<IFormProps, 'form'>((props, ref) => {
  return <Box as='form' ref={ref} {...props} />;
});
