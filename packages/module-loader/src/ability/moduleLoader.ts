/**
 * moduleLoader
 */
import _Vue, { VueConstructor } from 'vue';
import { print, warn, error, isPlainObject, isFunction } from '@vue-async/utils';
import { Modules, ModuleRemoteConfig } from '../../types';

const isProduction = process.env.NODE_ENV === 'production';

interface MutableRefObject<T> {
  current: T;
}

export default (Vue: typeof _Vue, status: MutableRefObject<boolean>) => {
  return function loader(this: VueConstructor, modules: Modules, { __isArray__ = false } = {}): Promise<void> {
    status.current = false;
    if (Array.isArray(modules) && modules.length) {
      return Promise.all(modules.map((module) => loader.call(this, module, { __isArray__: true }))).then(() => {
        status.current = true;
      });
    } else if (isPlainObject(modules)) {
      // resolve in the server render
      if (Vue.prototype.$isServer) {
        if (!__isArray__) {
          status.current = true;
        }
        return Promise.resolve();
      }
      /** 通过模块清单加载模块 */
      const promiseAll = [] as Array<Promise<void>>;
      for (const moduleName in modules) {
        // todo: Duplicated module name
        if (!window[moduleName]) {
          promiseAll.push(
            new Promise((resolve) => {
              const moduleConfig = (modules as ModuleRemoteConfig)[moduleName];
              // load css
              if (isPlainObject(moduleConfig) && moduleConfig.css) {
                (Array.isArray(moduleConfig.css) ? moduleConfig.css : [moduleConfig.css]).map((href) => {
                  const link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.type = 'text/css';
                  link.href = href;
                  link.dataset.styleFor = moduleName;
                  document.getElementsByTagName('head')[0].appendChild(link);
                });
              }
              // load module
              const entry = typeof moduleConfig === 'string' ? moduleConfig : moduleConfig.entry;
              const script = document.createElement('script');
              script.src = entry;
              script.onload = () => {
                const module = window[moduleName];
                if (module) {
                  isFunction(module)
                    ? module.call(this, Vue)
                    : typeof module.default === 'function' // requirejs
                    ? module.default.call(this, Vue)
                    : warn(isProduction, `module "${moduleName}" entry must be a function，ignored it.`);
                  if (!isProduction) {
                    print(`module:${moduleName}`, 'loaded');
                  }
                } else {
                  warn(isProduction, `module "${moduleName}" loaded failed，ignored it.`);
                }
                resolve();
              };
              script.onerror = () => {
                warn(isProduction, `module "${moduleName}" had a problem to create, ignored it.`);
                resolve();
              };
              document.body.appendChild(script);
            }),
          );
        }
      }
      return Promise.all(promiseAll).then(() => {
        if (!__isArray__) {
          status.current = true;
        }
      });
    } else if (typeof modules === 'function') {
      /** 通过模块函数加载模块 */
      const result = (modules as Function).call(this, Vue);
      if (result && result instanceof Promise) {
        return result.then(() => {
          if (!__isArray__) {
            status.current = true;
          }
        });
      } else {
        if (!__isArray__) {
          status.current = true;
        }
        return Promise.resolve();
      }
    } else {
      error(isProduction, '模块加载方法只接受模块列表对象或者模块函数对象作为参数。');
      if (!__isArray__) {
        status.current = true;
      }
      return Promise.resolve();
    }
  };
};
