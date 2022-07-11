import { inject, ref, Ref } from 'vue-demi';
import { AjaxClientSymbol } from '../shared/context';

// Types
import { Client } from '../../types';

export function useClient(): Ref<Client> {
  const client = inject(AjaxClientSymbol, ref<any>());

  return client;
}
