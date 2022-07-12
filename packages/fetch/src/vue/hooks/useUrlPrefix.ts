import { inject, ref, Ref } from 'vue-demi';
import { FetchUrlPrefixSymbol } from '../shared/context';

export function useUrlPrefix(): Ref<string> {
  const prefix = inject(FetchUrlPrefixSymbol, ref<any>());

  return prefix;
}
