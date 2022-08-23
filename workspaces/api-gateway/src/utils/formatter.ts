/* eslint-disable @typescript-eslint/no-explicit-any */
import { is } from 'ramda';

function camelize(str: string): string {
  return str?.replace(/^([A-Z])|[\s-_/]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }

    return p1.toLowerCase();
  });
}

export function camelizeKeys(data: any): any {
  if (!is(Object, data) || is(Date, data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((datumn) => {
      return camelizeKeys(datumn);
    });
  }

  return Object.entries(data).reduce((result, [k, v]) => {
    let value: any;

    if (!is(Object, v) || is(Date, v)) {
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
