import { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';

export interface ModuleContext {
  $componentLoader: (componentName: string, path: string, styles?: string | string[]) => Promise<VueComponent>;
  $eventBus: {
    emit: (eventName: string, playload: any) => void;
    on: (eventName: string, handler: (playload: any) => void) => void;
    off: (eventName: string, handler: (playload: any) => void) => void;
    clear: () => void;
    getEvents: () => Record<string, any>;
  };
}

export interface Framework {
  addRouters: (routes: RouteConfig[]) => void; // 可以被重写
}
