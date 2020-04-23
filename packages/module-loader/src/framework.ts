import _Vue, { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { error } from '@vue-async/utils';
import { ModuleData } from './ability/moduleLoader';
import install from './install';

export type ModuleLoaderOptions = {
  modules?: ModuleData | ModuleData[];
  [key: string]: any;
};

export default class ModuleLoader {
  static install = install;

  // static installed = false

  static version = '__VERSION__';

  __initModules__?: ModuleData | ModuleData[];
  __ExtraParams__?: { [key: string]: any };

  framework = {
    loaded: false,
    layouts: {},
  };

  constructor({ modules, ...rest }: ModuleLoaderOptions = {}) {
    this.__initModules__ = modules;
    this.__ExtraParams__ = rest;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: _Vue, ssrContext: any) {
    Object.defineProperties(this.framework, {
      addRoutes: {
        value: this.initAddRoutes(root),
        writable: false,
      },
      addLayouts: {
        value: this.initAddLayouts(root),
        writable: false,
      },
    });

    this.__ExtraParams__ &&
      Object.entries(this.__ExtraParams__).map(([key, value]) => {
        if (!this.framework.hasOwnProperty(key)) {
          // @ts-ignore
          this.framework[key] = value;
        }
      });
  }

  initModules(root: _Vue) {
    if (this.__initModules__) {
      return root.$moduleLoader(this.__initModules__).then(() => {
        this.framework.loaded = true;
      });
    } else {
      this.framework.loaded = true;
      return Promise.resolve();
    }
  }

  initAddRoutes(root: _Vue) {
    return (routes: Array<RouteConfig>) => {
      if (root.$router) {
        root.$router.addRoutes(routes);
      } else {
        error(process.env.NODE_ENV === 'production', 'vm.$router未定义');
      }
    };
  }

  initAddLayouts(root: _Vue) {
    return (key: string, layout: VueComponent) => {
      if (typeof key === 'string') {
        root.$set(this.framework.layouts, key, layout);
      } else if (
        key !== null &&
        (typeof key === 'object' || typeof key === 'function') &&
        Object.getPrototypeOf(key) === Object.prototype
      ) {
        // plain object
        const layouts = key;
        this.framework.layouts = Object.assign(this.framework.layouts, layouts);
      } else {
        error(process.env.NODE_ENV === 'production', 'addLayouts中支持字符串(key)或 Object(key/value)格式');
      }
    };
  }
}
