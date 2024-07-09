import type { Resolver } from './types';

export function defineResolver<Context>(resolver: Resolver<Context>) {
  return resolver;
}
