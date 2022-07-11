import { Ref } from 'vue-demi';
import { MethodUrl, RegistApi } from '../../types';
export declare function useRegistApi<C extends Record<string, MethodUrl>>(): Ref<RegistApi<C>>;
