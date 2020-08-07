import { VueConstructor, Component as VueComponent, AsyncComponent, PluginFunction } from 'vue';
import { RouteConfig } from 'vue-router';

export declare class ModuleLoader<ExtraOptions = Record<string, any>> {
  constructor(options: ModuleLoaderOptions<ExtraOptions>);
  readonly framework: Framework & ExtraOptions;

  static install: PluginFunction<never>;
  static version: string;
}

export type ModuleRemoteConfig = Record<
  string,
  | string
  | {
      entry: string;
      css: string | string[];
    }
>;

type ModuleData = ModuleRemoteConfig | ((Vue: VueConstructor) => Promise<boolean> | null | void);

export type Modules = ModuleData | ModuleData[];

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | ({ component: VueComponent | AsyncComponent; name?: string } & Record<string, any>);

export type ModuleLoaderOptions<T = Record<string, any>> = Omit<T, 'layouts'> & Partial<Omit<Framework, 'layouts'>>;

export interface Framework {
  readonly layouts: Record<string, VueComponent | AsyncComponent>;
  addRoutes: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
