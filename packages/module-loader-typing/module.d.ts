import { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';

export type DynamicComponent =
  | VueComponent
  | AsyncComponent
  | ({ component: VueComponent | AsyncComponent; name?: string } & Record<string, any>);

export interface ModuleContext {
  $componentLoader: (componentName: string, path: string, styles?: string | string[]) => Promise<VueComponent>;
  $dynamicComponent?: {
    namespaces: string;
    add: (component: DynamicComponent, position?: string) => void;
    remove: (name: string, position?: string) => void;
  };
  $eventBus: {
    emit: (eventName: string, playload: any) => void;
    on: (eventName: string, handler: (playload: any) => void) => void;
    off: (eventName: string, handler: (playload: any) => void) => void;
    clear: () => void;
    getEvents: () => Record<string, any>;
  };
}

export interface Framework {
  readonly layouts: Record<string, VueComponent | AsyncComponent>;
  addRouters: (routes: RouteConfig[]) => void; // 可以被重写
  addLayouts: (name: string, layout: VueComponent) => void; // 可以被重写
}
