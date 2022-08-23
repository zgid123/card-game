/* eslint-disable no-console */
import * as React from 'react';

import { createContext, useContext, useReducer, useCallback } from 'react';

import type { ReactNode } from 'react';

import type { IUserVMProps } from 'interfaces/userVM';

interface IAuthContextStateProps {
  isIdle: boolean;
  profile: IUserVMProps;
  isAuthenticated: boolean;
}

interface IAuthContextProps extends IAuthContextStateProps {
  signOut: () => void;
  unauthenticate: () => void;
  signIn: (data: IUserVMProps) => void;
}

interface IAuthProviderProps {
  children: ReactNode;
}

type TAuthContextAction =
  | {
      type: 'signIn';
      payload: { profile: IUserVMProps };
    }
  | {
      type: 'signOut';
    };

function AuthStateContext(
  state: IAuthContextStateProps,
  action: TAuthContextAction,
): IAuthContextStateProps {
  switch (action.type) {
    case 'signIn': {
      return {
        isIdle: false,
        isAuthenticated: true,
        profile: action.payload.profile,
      };
    }
    case 'signOut': {
      return {
        isIdle: false,
        isAuthenticated: false,
        profile: {} as IUserVMProps,
      };
    }
    default: {
      return state;
    }
  }
}

const defaultValue: IAuthContextStateProps = {
  isIdle: true,
  isAuthenticated: false,
  profile: {} as IUserVMProps,
};

const AuthContext = createContext<IAuthContextProps>({
  ...defaultValue,
  signOut: () => {
    return;
  },
  unauthenticate: () => {
    return;
  },
  signIn: (_data) => {
    return;
  },
});

export function AuthProvider({ children }: IAuthProviderProps) {
  const [state, dispatch] = useReducer(AuthStateContext, defaultValue);

  const signIn = useCallback((data: IUserVMProps): void => {
    dispatch({
      type: 'signIn',
      payload: {
        profile: data,
      },
    });
  }, []);

  const signOut = useCallback((): void => {
    dispatch({
      type: 'signOut',
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, signIn, signOut, unauthenticate: signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): IAuthContextProps {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.log('useAuthContext must be used inside AuthProvider');
  }

  return authContext;
}
