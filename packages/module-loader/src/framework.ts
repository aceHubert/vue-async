import _Vue, { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { error, warn, hasOwn, isPlainObject } from '@vue-async/utils';
import { Modules } from './ability/moduleLoader';
import install from './install';

export type ModuleLoaderOptions = {
  modules?: Modules;
  [key: string]: any;
};

export default class ModuleLoader {
  static install = install;

  // static installed = false

  static version = '__VERSION__';

  __initModules__?: Modules;
  __ExtraParams__?: { [key: string]: any };

  framework: { [key: string]: any } = {
    loaded: false,
    layouts: {},
  };

  constructor({ modules, ...rest }: ModuleLoaderOptions = {}) {
    this.__initModules__ = modules;
    this.__ExtraParams__ = rest;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: _Vue, ssrContext: any) {
    this.__ExtraParams__ &&
      Object.entries(this.__ExtraParams__).map(([key, value]) => {
        if (!hasOwn(this.framework, key)) {
          this.framework[key] = value;
        } else {
          warn(process.env.NODE_ENV === 'production', `参数 ${key} 已在在`);
        }
      });

    // 默认方法
    !hasOwn(this.framework, 'addRoutes') && (this.framework.addRoutes = this.initAddRoutes(root));
    !hasOwn(this.framework, 'addLayouts') && (this.framework.addLayouts = this.initAddLayouts(root));
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
    return (key: string | { [key: string]: VueComponent | AsyncComponent }, layout: VueComponent | AsyncComponent) => {
      if (typeof key === 'string') {
        root.$set(this.framework.layouts, key, layout);
      } else if (isPlainObject(key)) {
        // plain object
        const layouts = key;
        this.framework.layouts = Object.assign(this.framework.layouts, layouts);
      } else {
        error(process.env.NODE_ENV === 'production', 'addLayouts中支持字符串(key)或 Object(key/value)格式');
      }
    };
  }
}
