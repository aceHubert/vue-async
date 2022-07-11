import { inject, ref, Ref } from 'vue-demi';
import { AjaxUrlPrefixSymbol } from '../shared/context';

export function useUrlPrefix(): Ref<string> {
  const prefix = inject(AjaxUrlPrefixSymbol, ref<any>());

  return prefix;
}
