/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseInterceptors } from '@nestjs/common';
import { MapInterceptor as MapperMapInterceptor } from '@automapper/nestjs';

import type { Dictionary, ModelIdentifier } from '@automapper/core';

import { HAS_LOCAL_MAPPER, MapInterceptor } from './MapInterceptor';

import type { TMapperOptions } from './interface';

export function UseMapperInterceptor<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(
  from: ModelIdentifier<TSource>,
  to: ModelIdentifier<TDestination>,
  options: TMapperOptions<TSource, TDestination> = {},
): MethodDecorator & ClassDecorator {
  return UseInterceptors(MapInterceptor(from, to, options));
}

export function UseLocalMapperInterceptor<
  TSource extends Dictionary<TSource>,
  TDestination extends Dictionary<TDestination>,
>(
  from: ModelIdentifier<TSource>,
  to: ModelIdentifier<TDestination>,
  options: TMapperOptions<TSource, TDestination> = {},
): MethodDecorator {
  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor) {
      Reflect.defineMetadata(HAS_LOCAL_MAPPER, true, descriptor.value);
    }

    return UseInterceptors(MapperMapInterceptor(from, to, options))(
      target,
      key,
      descriptor,
    );
  };
}
