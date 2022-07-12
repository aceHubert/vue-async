import { inject, ref, Ref } from 'vue-demi';
import { FetchClientSymbol } from '../shared/context';

// Types
import { Client } from '../../types';

export function useClient(): Ref<Client> {
  const client = inject(FetchClientSymbol, ref<any>());

  return client;
}
