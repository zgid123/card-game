/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from 'axios';

export type TObject = Record<string, any>;

interface IEndpointProps {
  url: string;
  query?: {
    [key: string]: string | number | string[] | undefined;
  };
}

export type TEndpoint = string | IEndpointProps;

export interface IOptionsParams {
  requiredAuth: boolean;
  headers?: AxiosRequestConfig['headers'];
}

export interface IOptionsResult {
  [key: string]: string | TObject;
}

export interface IRequestProps {
  ssr?: boolean;
  version?: number;
  endpoint: TEndpoint;
  isExternal?: boolean;
  skipVersion?: boolean;
  requiredAuth?: boolean;
  headers?: AxiosRequestConfig['headers'];
  method: 'get' | 'post' | 'put' | 'delete';
}

export interface IRequestBody {
  data?: TObject;
  onUploadProgress?: AxiosRequestConfig['onUploadProgress'];
}

export interface IRequestParams {
  params?: TObject;
  signal?: AxiosRequestConfig['signal'];
}

export type TGetParams = IRequestParams &
  Exclude<Omit<IRequestProps, 'method'>, IRequestBody>;

export interface IErrorProps {
  name: string;
  status: number;
  detail: string;
  message: string;
  isNetworkError: boolean;
}

export interface IApiRequestProps {
  signal?: AxiosRequestConfig['signal'];
}
