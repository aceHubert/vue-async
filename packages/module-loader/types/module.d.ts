import { VueConstructor, Component as VueComponent, AsyncComponent, PluginFunction } from 'vue';
import { RouteConfig } from 'vue-router';

export declare class ModuleLoader<T = Record<string, any>> {
  constructor(options: ModuleLoaderExtension<T>);
  readonly framework: Framework & T;

  static install: PluginFunction<never>;
  static version: string;
}

export type ModuleRemoteConfig = {
  moduleName: string;
  entry: string;
  styles?: string | string[];
  args?: Record<string, any>; // 如果设置 将会传入到 bootstrap 的第二个参数
  // sandbox?: boolean;
  // activeRule?: (location: string) => boolean;
};

/**
 * { entry: 'remote/xx.js', moduleName: 'name', ...rest}  // object entry
 * { libName:'remote/xx.js'}} // string entry with specified lib name
 * { libName:{ entry: 'remote/xx.js', ...rest}} // object entry with specified lib name
 * (Vue)=> Promise<void> | void  // function
 */
type ModuleData =
  | ModuleRemoteConfig
  | Record<string, string | Omit<ModuleRemoteConfig, 'moduleName'>>
  | ((Vue: VueConstructor) => Promise<void> | void);

export type Modules = ModuleData | ModuleData[];

export type ModuleLoaderOption = {
  // strictGlobal?: boolean;
  success?: () => void; // all module loaded
  error?: (msg: string, module?: any) => void; // every single module loaded error with message, module: formated module config
};

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | ({ component: VueComponent | AsyncComponent; name?: string } & Record<string, any>);

export type ModuleLoaderExtension<T = Record<string, any>> = Omit<T, 'layouts'> & Partial<Omit<Framework, 'layouts'>>;

export interface Framework {
  readonly layouts: Record<string, VueComponent | AsyncComponent>;
  addRoutes: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
