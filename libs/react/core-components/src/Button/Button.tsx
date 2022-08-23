import * as React from 'react';

import { useMemo } from 'react';
import { Button as ChakraButton } from '@chakra-ui/react';

import type { ButtonProps, ComponentWithAs } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IButtonProps extends ButtonProps {}

export const Button: ComponentWithAs<'button', IButtonProps> = ({
  children,
  isLoading,
  loadingText,
  ...props
}) => {
  const styleProps = useMemo<IButtonProps>(() => {
    const result: IButtonProps = {};

    if (typeof children === 'string' && !loadingText) {
      result.loadingText = children;
    } else {
      result.loadingText = loadingText;
    }

    return result;
  }, [children, loadingText]);

  return (
    <ChakraButton
      _hover={{}}
      _focus={{}}
      _active={{}}
      colorScheme='teal'
      isLoading={isLoading}
      {...props}
      {...styleProps}
    >
      {children}
    </ChakraButton>
  );
};
