import _Vue, { Component as VueComponent, AsyncComponent } from 'vue';
import { RouteConfig } from 'vue-router';
import { error, warn, hasOwn, isPlainObject } from '@vue-async/utils';
import { Framework, ModuleLoaderOptions } from '../types';
import install from './install';

export default class ModuleLoader<ExtraOptions = Record<string, any>> {
  static install = install;
  static installed = false;
  static version = '__VERSION__';

  private _options: ModuleLoaderOptions<ExtraOptions>;
  private _framework: Record<string, any> = {
    layouts: {},
  };

  constructor(options: ModuleLoaderOptions<ExtraOptions>) {
    this._options = options;
  }

  get framework() {
    return this._framework as Framework & ExtraOptions;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: _Vue, ssrContext: any) {
    this._options &&
      Object.entries(this._options).map(([key, value]) => {
        if (!hasOwn(this._framework, key)) {
          this._framework[key] = value;
        } else {
          warn(process.env.NODE_ENV === 'production', `参数 ${key} 已在在`);
        }
      });

    // 默认方法
    !hasOwn(this._framework, 'addRoutes') && (this._framework.addRoutes = this._createAddRoutes(root));
    !hasOwn(this._framework, 'addLayouts') && (this._framework.addLayouts = this._createAddLayouts(root));
  }

  private _createAddRoutes(root: _Vue) {
    return (routes: RouteConfig[]) => {
      if (root.$router) {
        root.$router.addRoutes(routes);
      } else {
        error(process.env.NODE_ENV === 'production', 'vm.$router未定义');
      }
    };
  }

  private _createAddLayouts(root: _Vue) {
    return (key: string | Record<string, VueComponent | AsyncComponent>, layout: VueComponent | AsyncComponent) => {
      if (typeof key === 'string') {
        root.$set(this._framework.layouts, key, layout);
      } else if (isPlainObject(key)) {
        // plain object
        const layouts = key;
        this._framework.layouts = Object.assign(this._framework.layouts, layouts);
      } else {
        error(process.env.NODE_ENV === 'production', 'addLayouts中支持字符串(key)或 Object(key/value)格式');
      }
    };
  }
}
