import { VueConstructor, Component as VueComponent, PluginFunction } from 'vue';
import { RouteConfig } from 'vue-router';

export type ModuleRemoteConfig = {
  moduleName: string;
  entry: string;
  styles?: string | string[];
  args?: Record<string, any>; // 如果设置 将会传入到 bootstrap 的第二个参数
};

/**
 * { entry: 'remote/xx.js', moduleName: 'name', ...rest}  // object entry
 * { libName:'remote/xx.js'}} // string entry with specified lib name
 * { libName:{ entry: 'remote/xx.js', ...rest}} // object entry with specified lib name
 * (Vue)=> Promise<void> | void  // function
 */
export type ModuleConfig =
  | ModuleRemoteConfig
  | Record<string, string | Omit<ModuleRemoteConfig, 'moduleName'>>
  | ((Vue: VueConstructor) => Promise<void> | void);

export type ModuleLoaderOptions = {
  sync?: true;
  success?: () => void; // all module loaded
  error?: (msg: string, module?: any) => void; // every single module loaded error with message, module: formated module config
};

export interface ModuleContext {
  $moduleLoader(config: ModuleConfig | ModuleConfig[], options?: ModuleLoaderOptions): Promise<void>;
  $componentLoader(componentName: string, path: string, styles?: string | string[]): Promise<VueComponent>;
  $eventBus: {
    emit(eventName: string, playload: any): void;
    on(eventName: string, handler: (playload: any) => void): void;
    off(eventName: string, handler: (playload: any) => void): void;
    clear(): void;
    getEvents(): Record<string, any>;
  };
}

export interface Framework {
  addRoutes(routes: RouteConfig[]): void; // 可以被重写
}

export declare class ModuleLoader<Options extends Record<string, any> = {}> {
  constructor(options?: Options);
  readonly framework: Framework & Options;
  load: ModuleContext['$moduleLoader'];
  loadComponent: ModuleContext['$componentLoader'];
  eventBus: ModuleContext['$eventBus'];

  static install: PluginFunction<never>;
  static version: string;
}
