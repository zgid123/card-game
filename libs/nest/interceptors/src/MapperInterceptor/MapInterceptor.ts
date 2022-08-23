import { map } from 'rxjs';
import { mixin, Optional } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';

import type { Observable } from 'rxjs';
import type {
  Mapper,
  Dictionary,
  MapOptions,
  ModelIdentifier,
} from '@automapper/core';
import type {
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

import {
  memoize,
  transformArray,
  getTransformOptions,
  shouldSkipTransform,
} from './utils';

import type { TMapperOptions } from './interface';

export const HAS_LOCAL_MAPPER = 'hasLocalMapper';

export const MapInterceptor: <
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(
  from: ModelIdentifier<TSource>,
  to: ModelIdentifier<TDestination>,
  options?: TMapperOptions<TSource, TDestination>,
) => NestInterceptor = memoize(createMapInterceptor);

function createMapInterceptor<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(
  from: ModelIdentifier<TSource>,
  to: ModelIdentifier<TDestination>,
  options?: TMapperOptions<TSource, TDestination>,
): new (...args: unknown[]) => NestInterceptor {
  const { isArray, mapperName, transformedMapOptions } =
    getTransformOptions(options);

  class MixinMapInterceptor implements NestInterceptor {
    constructor(
      @Optional()
      @InjectMapper(mapperName)
      private readonly mapper?: Mapper,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const hasLocalMapper = Reflect.getMetadata(
        HAS_LOCAL_MAPPER,
        context.getHandler(),
      );

      if (hasLocalMapper) {
        return next.handle();
      }

      if (shouldSkipTransform(this.mapper, from, to)) {
        return next.handle();
      }

      try {
        return next.handle().pipe(
          map((response) => {
            if (isArray) {
              return transformArray(
                response,
                this.mapper,
                from,
                to,
                transformedMapOptions as unknown as MapOptions<
                  TSource[],
                  TDestination[]
                >,
              );
            }

            return this.mapper?.map(response, from, to, transformedMapOptions);
          }),
        );
      } catch {
        return next.handle();
      }
    }
  }

  return mixin(MixinMapInterceptor);
}
