import type { GetResolver } from './types';

export function defineResolver<Context>(resolver: GetResolver<Context>): GetResolver<Context> {
  return resolver;
}
