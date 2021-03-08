import { RouteConfig } from 'vue-router';
import { error, warn, hasOwn } from '@vue-async/utils';
import install from './install';

// Types
import { VueConstructor } from 'vue';
import { Framework } from 'types/module';

export default class ModuleLoader<Options = Record<string, any>> {
  static install = install;
  static installed = false;
  static version = '__VERSION__';

  private _framework: Record<string, any> = {};

  constructor(options?: Options) {
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
    return this._framework as Framework & Options;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  init(root: InstanceType<VueConstructor>, ssrContext: any) {
    // 默认方法
    !hasOwn(this._framework, 'addRoutes') && (this._framework.addRoutes = this._createAddRoutes(root));
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
}
