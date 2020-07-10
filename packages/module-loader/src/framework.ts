import _Vue, { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { error, warn, hasOwn, isPlainObject } from '@vue-async/utils';
import { ModuleLoaderOptions } from '../types';
import install from './install';

export default class ModuleLoader {
  static install = install;

  // static installed = false

  static version = '__VERSION__';

  __OPTIONS__: ModuleLoaderOptions;

  framework: Record<string, any> = {
    layouts: {},
  };

  constructor(options: ModuleLoaderOptions = {}) {
    this.__OPTIONS__ = options;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: _Vue, ssrContext: any) {
    Object.entries(this.__OPTIONS__).map(([key, value]) => {
      if (!hasOwn(this.framework, key)) {
        this.framework[key] = value;
      } else {
        warn(process.env.NODE_ENV === 'production', `参数 ${key} 已在在`);
      }
    });

    // 默认方法
    !hasOwn(this.framework, 'addRoutes') && (this.framework.addRoutes = this._createAddRoutes(root));
    !hasOwn(this.framework, 'addLayouts') && (this.framework.addLayouts = this._createAddLayouts(root));
  }

  _createAddRoutes(root: _Vue) {
    return (routes: Array<RouteConfig>) => {
      if (root.$router) {
        root.$router.addRoutes(routes);
      } else {
        error(process.env.NODE_ENV === 'production', 'vm.$router未定义');
      }
    };
  }

  _createAddLayouts(root: _Vue) {
    return (key: string | Record<string, VueComponent | AsyncComponent>, layout: VueComponent | AsyncComponent) => {
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
