import { inject, ref, Ref } from 'vue-demi';
import { FetchRegistApiSymbol } from '../shared/context';

// Types
import { MethodUrl, RegistApi } from '../../types';

export function useRegistApi<C extends Record<string, MethodUrl>>(): Ref<RegistApi<C>> {
  const registApi = inject(FetchRegistApiSymbol, ref<any>({}));

  return registApi;
}
