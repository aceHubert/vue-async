import { inject } from 'vue-demi';
import { InjectSymbol } from '../shared/context';
import { InjectFunction } from '../types';

export function useInject(): InjectFunction {
  const injectFn = inject(InjectSymbol, {} as InjectFunction);

  return injectFn;
}
