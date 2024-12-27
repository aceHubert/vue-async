import { App, Vue2 } from 'vue-demi';
import { RegisterProperties } from '../types';

/**
 * Bootstrap根据 activeRule 仅在第一次加载时调用
 */
export type Bootstrap = (App: App | typeof Vue2) => void;

/**
 * Mount根据 activeRule 在每一次被激活时调用
 */
export type Mount = <Props extends ModuleLoaderCustomProperties = ModuleLoaderCustomProperties>(
  App: App | typeof Vue2,
  props: Props,
) => void | RegisterProperties | Promise<void | RegisterProperties>;

/**
 * Unmount根据 activeRule 在每一次被销毁时被调用
 */
export type Unmount = <Props extends ModuleLoaderCustomProperties = ModuleLoaderCustomProperties>(
  App: App | typeof Vue2,
  props: Props,
) => void;

export interface ModuleLoaderCustomProperties {
  [key: string]: any;
}
