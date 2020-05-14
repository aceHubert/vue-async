import { VueConstructor, Component as VueComponent, AsyncComponent, PluginFunction } from 'vue';
import { Store } from 'vuex';
import VueRouter, { RouteConfig } from 'vue-router';

type ModuleData =
  | {
      [moduleName: string]: string;
    }
  | ((vue: VueConstructor) => Promise<boolean> | null);

export type Modules = ModuleData | ModuleData[];

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | {
      component: VueComponent | AsyncComponent;
      cols?: number;
      [key: string]: any;
    };

export type ModuleLoaderOptions = {
  modules?: Modules;
  [key: string]: any;
};

export type UseOptions = {
  store?: Store<any>;
  router?: VueRouter;
};

export declare const ModuleLoader: ModuleLoader;

export interface ModuleLoader {
  framework: Framework;
  install: PluginFunction<UseOptions>;
  version: string;
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (options: ModuleLoaderOptions): ModuleLoader;
}

export interface Framework {
  loaded: boolean;
  layouts: {
    [layoutName: string]: VueComponent;
  };
  addRouters: (routes: RouteConfig[]) => void;
  addLayouts: (name: string, layout: VueComponent) => void;
  // 扩展参数
  [key: string]: any;
}
