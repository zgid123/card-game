/* eslint-disable @typescript-eslint/no-explicit-any */
import { is, isNil } from 'ramda';
import { useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { UseQueryResult } from '@tanstack/react-query';

import type {
  TOptions,
  TAsyncFunc,
  IErrorProps,
  TQueryKeyParams,
} from './interface';

export type TUseFetchReturn<
  TQueryFnData = unknown,
  TError = IErrorProps,
  TQueryFn extends TAsyncFunc<TQueryFnData> = TAsyncFunc<TQueryFnData>,
  TData = Awaited<ReturnType<TQueryFn>>,
  TSelect = unknown,
  TDefaultValue = unknown,
  TQueryKey extends TQueryKeyParams<TData, TQueryFn> = TQueryKeyParams<
    TData,
    TQueryFn
  >,
  TQueryOptions extends TOptions<
    TQueryFn,
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TSelect
  > = TOptions<TQueryFn, TQueryFnData, TError, TData, TQueryKey, TSelect>,
  TInitialDataOption = TQueryOptions['initialData'],
  TUseQueryResult = UseQueryResult<TData, TError>,
> = TSelect extends (data: TData) => infer TSelectReturn
  ? TInitialDataOption extends TSelectReturn
    ? Omit<TUseQueryResult, 'data'> & {
        data: TSelectReturn;
        setData: (func: (data: TSelectReturn) => TSelectReturn) => void;
      }
    : TInitialDataOption extends Partial<TSelectReturn>
    ? Omit<TUseQueryResult, 'data'> & {
        data: TSelectReturn;
        setData: (func: (data: TSelectReturn) => TSelectReturn) => void;
      }
    : TDefaultValue extends undefined
    ? Omit<TUseQueryResult, 'data'> & {
        data?: TSelectReturn;
        setData: (func: (data: TSelectReturn) => TSelectReturn) => void;
      }
    : Omit<TUseQueryResult, 'data'> & {
        data: TSelectReturn;
        setData: (func: (data: TSelectReturn) => TSelectReturn) => void;
      }
  : TInitialDataOption extends Partial<TData>
  ? Omit<TUseQueryResult, 'data'> & {
      data: TData;
      setData: (func: (data: TData) => TData) => void;
    }
  : TInitialDataOption extends () => TData
  ? Omit<TUseQueryResult, 'data'> & {
      data: TData;
      setData: (func: (data: TData) => TData) => void;
    }
  : TInitialDataOption extends () => Partial<TData>
  ? Omit<TUseQueryResult, 'data'> & {
      data: TData;
      setData: (func: (data: TData) => TData) => void;
    }
  : TUseQueryResult & {
      setData: (func: (data: TData) => TData) => void;
    };

export function useFetch<
  TQueryFnData = unknown,
  TError = IErrorProps,
  TQueryFn extends TAsyncFunc<TQueryFnData> = TAsyncFunc<TQueryFnData>,
  TData = Awaited<ReturnType<TQueryFn>>,
  TSelectParam = TData,
  TSelect = (data: TSelectParam) => TData,
  TDefaultValue =
    | (TSelect extends (data: TSelectParam) => infer TSelectReturn
        ? TSelectReturn
        : TData)
    | undefined,
  TQueryKey extends TQueryKeyParams<TData, TQueryFn> = TQueryKeyParams<
    TData,
    TQueryFn
  >,
  TQueryOptions extends TOptions<
    TQueryFn,
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TSelect
  > = TOptions<TQueryFn, TQueryFnData, TError, TData, TQueryKey, TSelect>,
  TInitialDataOption = TQueryOptions['initialData'],
  TUseQueryResult = UseQueryResult<TData, TError>,
>(
  queryFn: TQueryFn,
  key: TQueryKey,
  options: TQueryOptions = {} as TQueryOptions,
  additionalOptions: {
    select?: TSelect;
    defaultValue?: TDefaultValue;
  } = {},
): TUseFetchReturn<
  TQueryFnData,
  TError,
  TQueryFn,
  TData,
  TSelect,
  TDefaultValue,
  TQueryKey,
  TQueryOptions,
  TInitialDataOption,
  TUseQueryResult
> {
  const { select, defaultValue } = additionalOptions;
  const defaultValueRef = useRef(defaultValue);
  const queryClient = useQueryClient();
  const queryKeyRef = useRef<TQueryKey>(key);
  const { initialData, ...opts } = options;

  const setData = useCallback(
    (
      func: (
        data: TSelect extends (data: TSelectParam) => infer TSelectReturn
          ? TSelectReturn
          : TData,
      ) => TSelect extends (data: TSelectParam) => infer TSelectReturn
        ? TSelectReturn
        : TData,
    ) => {
      queryClient.setQueryData(queryKeyRef.current, (data: any) => func(data));
    },
    [queryClient],
  );

  const { data, ...methods } = useQuery(
    key as TQueryKey,
    ({ queryKey, signal }) => {
      const params = ((queryKey as unknown as [string, []])[1] || []) as any[];

      if (params.length) {
        params.forEach((param) => {
          if (
            !is(Date, param) &&
            !Array.isArray(param) &&
            !isNil(param) &&
            is(Object, param)
          ) {
            param.signal = signal;
          }
        });
      } else {
        params.push({ signal });
      }

      return queryFn(...params);
    },
    {
      select,
      initialData,
      retry: false,
      refetchOnWindowFocus: false,
      ...opts,
    } as any, // TODO: fix type
  ) as unknown as TUseFetchReturn<
    TQueryFnData,
    TError,
    TQueryFn,
    TData,
    TSelect,
    TDefaultValue,
    TQueryKey,
    TQueryOptions,
    TInitialDataOption,
    TUseQueryResult
  > & { data: TData };

  return {
    ...methods,
    setData,
    data: data || defaultValueRef.current,
  } as unknown as TUseFetchReturn<
    TQueryFnData,
    TError,
    TQueryFn,
    TData,
    TSelect,
    TDefaultValue,
    TQueryKey,
    TQueryOptions,
    TInitialDataOption,
    TUseQueryResult
  >;
}
