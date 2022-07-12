import { InjectionKey, Ref } from 'vue-demi';

// Types
import { Client, RegistApi } from '../../types';

export const FetchClientSymbol: InjectionKey<Ref<Client>> = Symbol('__FetchPromiseClient__');

export const FetchRegistApiSymbol: InjectionKey<Ref<RegistApi<any>>> = Symbol('__FetchRegistApi__');

export const FetchUrlPrefixSymbol: InjectionKey<Ref<string>> = Symbol('__FetchUrlPrefix__');
