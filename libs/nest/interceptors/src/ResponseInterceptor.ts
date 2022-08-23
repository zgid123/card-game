import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';

import type { Observable } from 'rxjs';
import type {
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

interface IResponseProps<T> {
  data: T;
  metadata?: Record<string, unknown>;
}

interface IMetadataResponseProps<T> {
  data: T;
  metadata: Record<string, unknown>;
}

export function respond<T>(
  data: T | IMetadataResponseProps<T>,
): IResponseProps<T> {
  if (
    !!data &&
    typeof data === 'object' &&
    Object.prototype.hasOwnProperty.call(data as unknown as object, 'metadata')
  ) {
    const { metadata, data: datumn } = data as IMetadataResponseProps<T>;

    return {
      data: datumn,
      metadata,
    };
  }

  return {
    data: data as T,
  };
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, IResponseProps<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponseProps<T>> {
    return next.handle().pipe(map((data) => respond(data)));
  }
}
