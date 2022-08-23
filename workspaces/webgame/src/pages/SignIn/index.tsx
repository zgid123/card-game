import * as React from 'react';

import { useEffect } from 'react';
import { parse } from 'query-string';
import { Flex, Stack } from '@chakra-ui/react';
import { useForm } from '@libs/rc-utils/useForm';
import { useRequest } from '@libs/rc-utils/queryHooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, FormInput } from '@libs/rc-components';

import type { SubmitHandler } from '@libs/rc-utils/useForm';

import { authApi } from 'requests/authApi';
import { useAuthContext } from 'contexts/AuthContext';

interface IFormValuesProps {
  username: string;
  password: string;
}

export function SignIn(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signIn } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  });

  const { isLoading, mutate } = useRequest(authApi.signIn, {
    onSuccess: ({ authToken, profile }) => {
      const { redirect } = parse(location.search);
      localStorage.setItem('authToken', authToken);
      signIn(profile);
      navigate((redirect as string) || '/');
    },
  });

  const { register, handleSubmit } = useForm<IFormValuesProps>();

  const onSubmit: SubmitHandler<IFormValuesProps> = (data) => {
    mutate(data);
  };

  return (
    <Flex h='100%' alignItems='center' justifyContent='center'>
      <Form
        py={10}
        px={20}
        bgColor='white'
        borderRadius='7px'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack spacing={5}>
          <FormInput name='username' label='Username' register={register} />
          <FormInput
            type='password'
            name='password'
            label='Password'
            register={register}
          />
          <Button type='submit' isLoading={isLoading}>
            Sign in
          </Button>
        </Stack>
      </Form>
    </Flex>
  );
}
