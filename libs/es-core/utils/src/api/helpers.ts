/* eslint-disable @typescript-eslint/no-explicit-any */
import { is } from 'ramda';

import type { AxiosError, AxiosResponse } from 'axios';

import { IErrorProps } from './interface';

function camelize(str: string): string {
  return str?.replace(/^([A-Z])|[\s-_/]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }

    return p1.toLowerCase();
  });
}

function camelizeKeys(data: any): any {
  if (is(Date, data) || !is(Object, data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((datumn) => {
      return camelizeKeys(datumn);
    });
  }

  return Object.entries(data).reduce((result, [k, v]) => {
    let value;

    if (is(Date, v) || !is(Object, v)) {
      value = v;
    } else {
      value = camelizeKeys(v);
    }

    Object.assign(result, {
      [camelize(k)]: value,
    });

    return result;
  }, {});
}

export function parseData({ data }: AxiosResponse): any {
  const hasDataWrapper = Object.prototype.hasOwnProperty.call(data, 'data');

  if (hasDataWrapper) {
    return camelizeKeys(data.data);
  }

  return camelizeKeys(data);
}

export function parseError(error: AxiosError): Promise<IErrorProps> {
  const { name, message, response } = error;
  const { data, status = 500 } = response || {};
  const isNetworkError = name === 'Error' && message === 'Network Error';

  return Promise.reject({
    name,
    data,
    status,
    message,
    isNetworkError,
  });
}
