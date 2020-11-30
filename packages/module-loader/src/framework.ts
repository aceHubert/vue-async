import { RouteConfig } from 'vue-router';
import { error, warn, hasOwn, isPlainObject } from '@vue-async/utils';
import install from './install';

// Types
import { VueConstructor, Component as VueComponent, AsyncComponent } from 'vue';
import { Framework, ModuleLoaderExtension } from 'types/module';

export default class ModuleLoader<T = Record<string, any>> {
  static install = install;
  static installed = false;
  static version = '__VERSION__';

  private _framework: Record<string, any> = {
    layouts: {},
  };

  constructor(options?: ModuleLoaderExtension<T>) {
    options &&
      Object.entries(options).map(([key, value]) => {
        if (!hasOwn(this._framework, key)) {
          this._framework[key] = value;
        } else {
          warn(process.env.NODE_ENV === 'production', `参数 ${key} 已在在`);
        }
      });
  }

  get framework() {
    return this._framework as Framework & T;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: InstanceType<VueConstructor>, ssrContext: any) {
    // 默认方法
    !hasOwn(this._framework, 'addRoutes') && (this._framework.addRoutes = this._createAddRoutes(root));
    !hasOwn(this._framework, 'addLayouts') && (this._framework.addLayouts = this._createAddLayouts(root));
  }

  private _createAddRoutes(root: InstanceType<VueConstructor>) {
    return (routes: RouteConfig[]) => {
      if (root.$router) {
        root.$router.addRoutes(routes);
      } else {
        error(process.env.NODE_ENV === 'production', 'vm.$router未定义');
      }
    };
  }

  private _createAddLayouts(root: InstanceType<VueConstructor>) {
    return (name: string | Record<string, VueComponent | AsyncComponent>, layout?: VueComponent | AsyncComponent) => {
      if (typeof name === 'string' && layout) {
        root.$set(this._framework.layouts, name, layout);
      } else if (isPlainObject(name)) {
        // plain object
        const layouts = name;
        this._framework.layouts = Object.assign(this._framework.layouts, layouts);
      } else {
        error(process.env.NODE_ENV === 'production', 'addLayouts参数错误');
      }
    };
  }
}
