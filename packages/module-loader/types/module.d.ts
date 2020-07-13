import { VueConstructor, Component as VueComponent, AsyncComponent, PluginFunction } from 'vue';
import { RouteConfig } from 'vue-router';

type ModuleData = Record<string, string> | ((vue: VueConstructor) => Promise<boolean> | null | void);

export type Modules = ModuleData | ModuleData[];

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | ({ component: VueComponent | AsyncComponent } & Record<string, any>);

export type ModuleLoaderOptions = Omit<Record<string, any>, 'layouts'>;

export declare const ModuleLoader: ModuleLoader;

export interface ModuleLoader {
  framework: Framework & ModuleLoaderOptions; // todo: 得不到 Options 中的实际类型
  install: PluginFunction<void>;
  version: string;
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (options: ModuleLoaderOptions): ModuleLoader;
}

export interface Framework {
  layouts: Record<string, VueComponent | AsyncComponent>;
  addRouters: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
