import type { Resolver } from './types';

export function defineResolver<Context>(resolver: Resolver<Context>): Resolver<Context> {
  return resolver;
}
