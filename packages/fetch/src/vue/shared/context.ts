import { InjectionKey, Ref } from 'vue-demi';

// Types
import { Client, RegistApi } from '../../types';

export const AjaxClientSymbol: InjectionKey<Ref<Client>> = Symbol('__AjaxClient__');

export const AjaxRegistApiSymbol: InjectionKey<Ref<RegistApi<any>>> = Symbol('__AjaxRegistApi__');

export const AjaxUrlPrefixSymbol: InjectionKey<Ref<string>> = Symbol('__AjaxUrlPrefix__');
