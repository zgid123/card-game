import type { FlexProps } from '@chakra-ui/react';

interface IUseWrapperPropsParams {
  fullWidth?: boolean;
  defaultProps?: FlexProps;
}

export function useWrapperProps({
  fullWidth = false,
  defaultProps = {},
}: IUseWrapperPropsParams): FlexProps {
  if (fullWidth) {
    return {
      ...defaultProps,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      position: 'fixed',
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  return defaultProps;
}
