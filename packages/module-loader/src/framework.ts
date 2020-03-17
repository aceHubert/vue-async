import _Vue, { Component as VueComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import install from './install';

export default class ModuleLoader {
  static install = install;

  // static installed = false

  static version = '0.1.0';

  __initModules__ = [];

  framework = {
    loaded: false,
    layouts: {},
  };

  constructor({ modules = [] } = {}) {
    this.__initModules__ = modules;
  }

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
  }

  initModules(root: _Vue) {
    if (this.__initModules__ && this.__initModules__.length) {
      root.$moduleLoader(this.__initModules__).then(_ => {
        this.framework.loaded = true;
      });
    }
  }

  initAddRoutes(root: _Vue) {
    return (routes: Array<RouteConfig>) => {
      if (root.$router) {
        root.$router.addRoutes(routes);
      } else {
        console.error('vm.$router未定义');
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
        console.error('addLayouts中支持字符串(key)或 Object(key/value)格式');
      }
    };
  }
}
