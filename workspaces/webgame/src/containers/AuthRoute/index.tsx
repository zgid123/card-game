import * as React from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import type { ReactElement } from 'react';

import { useAuthContext } from 'contexts/AuthContext';

interface IAuthRouteProps {
  children: ReactElement;
}

export function AuthRoute({ children }: IAuthRouteProps): ReactElement {
  const location = useLocation();
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to={`/sign-in?redirect=${location.pathname}`} replace />;
  }

  return children;
}
