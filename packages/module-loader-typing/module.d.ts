import { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | ({ component: VueComponent | AsyncComponent; name?: string } & Record<string, any>);

export interface Framework {
  readonly layouts: Record<string, VueComponent | AsyncComponent>;
  addRouters: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
