import { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';

export type ModuleLoaderOptions = Omit<Record<string, any>, 'layouts'>;

export interface Framework {
  layouts: Record<string, VueComponent | AsyncComponent>;
  addRouters: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
