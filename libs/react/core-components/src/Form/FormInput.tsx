/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

import get from 'lodash.get';
import { Controller } from 'react-hook-form';
import { useMemo, cloneElement, createElement, isValidElement } from 'react';
import {
  Input,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

import type { InputProps } from '@chakra-ui/react';
import type { ReactElement, ComponentType } from 'react';
import type {
  Control,
  UseFormReturn,
  RegisterOptions,
  UseFormRegisterReturn,
} from 'react-hook-form';

import type { AsProps } from '../interface';

type TComponent = ReactElement | ComponentType<any>;

interface IElementComponentProps {
  control: Control<any>;
}

interface IFormInputDefaultProps<T extends undefined | TComponent> {
  name: string;
  label?: string;
  attachment?: ReactElement;
  component?: T | typeof Input;
  validationRule?: RegisterOptions;
  errors?: UseFormReturn['formState']['errors'];
  register?: UseFormReturn<any>['register'] | UseFormRegisterReturn;
}

type TElementComponentProps = InputProps & IElementComponentProps;

type TFormInputProps<T extends undefined | TComponent> =
  IFormInputDefaultProps<T> &
    (T extends ReactElement ? TElementComponentProps : InputProps);

export function FormInput<T extends undefined | TComponent>({
  name,
  label,
  register,
  attachment,
  errors = {},
  validationRule,
  component = Input,
  onChange: onExternalChange,
  ...restProps
}: TFormInputProps<T> & AsProps<T, InputProps>): JSX.Element {
  const { control, ...props } = restProps as unknown as TElementComponentProps;
  const errorMessage = get(errors, `${name}.message`, '');
  const isValid = isValidElement(component);

  const content = useMemo(() => {
    if (isValid) {
      return (
        <Controller
          name={name}
          control={control}
          rules={validationRule}
          render={({
            field: { onChange: onInternalChange, name, ref, value },
          }) => {
            const onChange: typeof onInternalChange = (params) => {
              onInternalChange(params);
              onExternalChange?.(params);
            };

            return cloneElement(component as ReactElement, {
              ...props,
              ref,
              name,
              onChange,
              value: value || component.props.value,
            });
          }}
        />
      );
    }

    let registerReturn;

    if (register) {
      if (typeof register === 'function') {
        registerReturn = register(name, validationRule);
      } else {
        registerReturn = register;
      }
    } else {
      registerReturn = {};
    }

    const { onChange: onInternalChange, ...registerProps } = registerReturn;

    const onChange: typeof onExternalChange = (params) => {
      onInternalChange?.(params);
      onExternalChange?.(params);
    };

    return createElement(component as ComponentType, {
      onChange,
      'aria-invalid': !!errorMessage,
      ...props,
      ...registerProps,
    });
  }, [
    isValid,
    register,
    name,
    validationRule,
    component,
    errorMessage,
    props,
    control,
    onExternalChange,
  ]);

  return (
    <FormControl pos='relative' w='100%' isInvalid={!!errorMessage}>
      {label && (
        <FormLabel mb={2.5} mr={0} fontSize='17px'>
          {label}
        </FormLabel>
      )}
      {content}
      {attachment}
      <FormErrorMessage mt={0} lineHeight='34px' color='red.400'>
        {errorMessage.toString()}
      </FormErrorMessage>
    </FormControl>
  );
}
