import { Component as VueComponent, PluginFunction } from 'vue';
import { RouteConfig } from 'vue-router';
import { ModuleLoaderOptions } from '../src/framework';
import { UseOptions } from '../src/install';
import { Modules, DynamicComponent } from '../src';

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

export { Modules, DynamicComponent };
