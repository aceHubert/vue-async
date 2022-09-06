import { RouteConfig } from 'vue-router';
import { Module, ModuleOptions } from 'vuex';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BootstrapRegisterCustomProperties {}

/**
 * Bootstrap
 * @param Vue 主程序中使用的Vue对象
 * @param args  主程序传递的自定义参数
 */
export interface Bootstrap<Args extends Record<string, any> = {}> {
  (Vue: VueConstructor, args?: Args):
    | void
    | RouteConfig[]
    | ({
        routes?: RouteConfig[];
        storeModules?: Record<string, Module<any, any> | [Module<any, any>, ModuleOptions]>;
        hooks?: Record<string, Function | [Function, { priority?: number; acceptedArgs?: number }]>;
      } & BootstrapRegisterCustomProperties);
}
