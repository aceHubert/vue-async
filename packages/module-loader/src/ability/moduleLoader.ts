/**
 * moduleLoader
 */
import _Vue, { VueConstructor } from 'vue';
import { print, warn, error } from '@vue-async/utils';

const isProduction = process.env.NODE_ENV === 'production';

interface MutableRefObject<T> {
  current: T;
}

type ModuleData =
  | {
      [moduleName: string]: string;
    }
  | ((vue: VueConstructor) => Promise<boolean> | null);

export type Modules = ModuleData | ModuleData[];

export default (Vue: typeof _Vue, status: MutableRefObject<boolean>) => {
  return function loader(this: VueConstructor, modules: Modules, { __isArray__ = false } = {}): Promise<void> {
    status.current = false;
    if (Array.isArray(modules) && modules.length) {
      return Promise.all(modules.map(module => loader.call(this, module, { __isArray__: true }))).then(() => {
        status.current = true;
      });
    } else if (typeof modules === 'object' && Object.getPrototypeOf(modules) === Object.prototype) {
      /** 通过模块清单加载模块 */
      const promiseAll = [];
      for (const moduleName in modules) {
        if (!window[moduleName as any]) {
          promiseAll.push(
            new Promise(resolve => {
              const script = document.createElement('script');
              script.src = (modules as any)[moduleName];
              script.onload = () => {
                if (window[moduleName as any]) {
                  typeof window[moduleName as any] === 'function'
                    ? (window[moduleName as any] as any).call(this, Vue)
                    : (window[moduleName as any] as any).default.call(this, Vue);
                  if (!isProduction) {
                    print(moduleName, 'loaded');
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
      const result = modules.call(this, Vue);
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
