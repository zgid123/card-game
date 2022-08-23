import * as React from 'react';

import { Flex, Spinner } from '@chakra-ui/react';

import type { FlexProps, SpinnerProps } from '@chakra-ui/react';

import { useWrapperProps } from './hooks';

export interface IPreloaderProps extends SpinnerProps {
  fullWidth?: boolean;
  wrapperProps?: FlexProps;
}

export function Preloader({
  wrapperProps,
  fullWidth = false,
  ...props
}: IPreloaderProps): JSX.Element {
  const defaultProps = useWrapperProps({
    fullWidth,
    defaultProps: wrapperProps,
  });

  return (
    <Flex {...defaultProps}>
      <Spinner {...props} />
    </Flex>
  );
}
