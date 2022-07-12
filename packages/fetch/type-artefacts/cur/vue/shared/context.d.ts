import { InjectionKey, Ref } from 'vue-demi';
import { Client, RegistApi } from '../../types';
export declare const FetchClientSymbol: InjectionKey<Ref<Client>>;
export declare const FetchRegistApiSymbol: InjectionKey<Ref<RegistApi<any>>>;
export declare const FetchUrlPrefixSymbol: InjectionKey<Ref<string>>;
