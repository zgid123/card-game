import { useEffect } from 'react';
import { useFetch } from '@libs/rc-utils/queryHooks';

import { authApi } from 'requests/authApi';
import { useAuthContext } from 'contexts/AuthContext';

interface IUseAutoLoginReturnProps {
  isLoading: boolean;
}

export function useAutoLogin(): IUseAutoLoginReturnProps {
  const { isIdle, signIn, unauthenticate } = useAuthContext();

  const { isLoading, refetch } = useFetch(
    authApi.getProfile,
    ['fetchCurrentUser', [[]]],
    {
      retry: false,
      enabled: false,
      onSuccess: (data) => {
        signIn(data);
      },
      onError: () => {
        unauthenticate();
      },
    },
  );

  useEffect(() => {
    if (isIdle) {
      refetch();
    }
  }, [isIdle, refetch]);

  return {
    isLoading: isLoading || isIdle,
  };
}
