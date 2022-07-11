import { InjectionKey, Ref } from 'vue-demi';
import { Client, RegistApi } from '../../types';
export declare const AjaxClientSymbol: InjectionKey<Ref<Client>>;
export declare const AjaxRegistApiSymbol: InjectionKey<Ref<RegistApi<any>>>;
export declare const AjaxUrlPrefixSymbol: InjectionKey<Ref<string>>;
