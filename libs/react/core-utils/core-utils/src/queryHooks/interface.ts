/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseQueryOptions } from '@tanstack/react-query';

type Primitive =
  | string
  | Function
  | number
  | boolean
  | Symbol
  | undefined
  | null;

type DeepOmitHelper<T, K extends keyof T> = {
  [P in K]: T[P] extends infer TP //extra level of indirection needed to trigger homomorhic behavior // distribute over unions
    ? TP extends Primitive
      ? TP // leave primitives and functions alone
      : TP extends any[]
      ? DeepOmitArray<TP, K> // Array special handling
      : DeepOmit<TP, K>
    : never;
};

type DeepOmit<T, K> = T extends Primitive
  ? T
  : DeepOmitHelper<T, Exclude<keyof T, K>>;

type DeepOmitArray<T extends any[], K> = {
  [P in keyof T]: DeepOmit<T[P], K>;
};

export type TAsyncFunc<T> = (...params: any[]) => Promise<T>;

export type TFunc<TData, TVariables> = (data: TVariables) => TData;

export type TQueryKeyParams<
  T,
  P extends TAsyncFunc<unknown> = TAsyncFunc<T>,
  TParams extends DeepOmitArray<Parameters<P>, 'signal'> = DeepOmitArray<
    Parameters<P>,
    'signal'
  >,
> = [string, TParams];

export type TIsUnknownOrAny<T> = T extends boolean | {}
  ? false
  : boolean extends boolean & T
  ? true
  : false;

export interface IErrorProps {
  name: string;
  status: number;
  detail: string;
  message: string;
  isNetworkError: boolean;
}

export type TInitialData<TData> = Partial<TData> | (() => Partial<TData>);

export type TOptions<
  TQueryFn extends TAsyncFunc<TQueryFnData>,
  TQueryFnData,
  TError,
  TData,
  TQueryKey extends TQueryKeyParams<TData, TQueryFn>,
  TSelect = unknown,
  TUseQueryOptions extends UseQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  > = UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
> = Omit<
  TUseQueryOptions,
  'queryKey' | 'queryFn' | 'initialData' | 'select'
> & {
  initialData?: TSelect extends (data: TData) => infer TSelectReturn
    ? TSelectReturn
    : TInitialData<TData>;
};
