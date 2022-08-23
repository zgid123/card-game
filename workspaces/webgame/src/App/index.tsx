import * as React from 'react';

import { Box } from '@chakra-ui/react';
import { Preloader } from '@libs/rc-components';
import { Route, Routes } from 'react-router-dom';

import { SignIn } from 'pages/SignIn';
import { Overview } from 'pages/Overview';
import { AuthRoute } from 'containers/AuthRoute';
import { DashboardLayout } from 'layouts/DashboardLayout';

import { useAutoLogin } from './hooks';

export function App(): JSX.Element {
  const { isLoading } = useAutoLogin();

  if (isLoading) {
    return <Preloader fullWidth />;
  }

  return (
    <Box w='100vw' h='100vh' p={3}>
      <Routes>
        <Route
          path='/'
          element={
            <AuthRoute>
              <DashboardLayout />
            </AuthRoute>
          }
        >
          <Route index element={<Overview />} />
        </Route>
        <Route path='sign-in' element={<SignIn />} />
      </Routes>
    </Box>
  );
}
