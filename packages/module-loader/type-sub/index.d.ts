import { Vue2, App } from 'vue-demi';
import { RouteConfig } from 'vue-router';
import { Module, ModuleOptions } from 'vuex';

declare global {
  interface Window {
    // 通过子模块加载
    VUE_ASYNC_MODULE_LOADER?: true;
  }
}

/**
 * Bootstrap根据 activeRule 仅在第一次加载时调用
 */
export type Bootstrap = (App: App | typeof Vue2) => void;

/**
 * Mount根据 activeRule 在每一次被激活时调用
 */
export type Mount = <Props extends Record<string, any>, State = any, RootState = any>(
  App: App | typeof Vue2,
  props?: Props,
) =>
  | void
  | RouteConfig[]
  | {
      routes?: RouteConfig[];
      stores?: Record<string, Module<State, RootState> | [Module<State, RootState>, ModuleOptions]>;
      injects?: Record<
        string,
        | Function
        | [
            Function,
            {
              priority?: number;
              acceptedArgs?: number;
            },
          ]
      >;
    };

/**
 * Unmount根据 activeRule 在每一次被销毁时被调用
 */
export type Unmount = <Props extends Record<string, any>>(App: App | typeof Vue2, props?: Props) => void;
