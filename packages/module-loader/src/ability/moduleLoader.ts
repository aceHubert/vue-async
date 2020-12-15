/**
 * moduleLoader
 */
import { error as globalError, warn as globalWarn, isPlainObject, isFunction } from '@vue-async/utils';
import * as spa from '../utils/spa';
import * as ssr from '../utils/ssr';

// Types
import { VueConstructor } from 'vue';
import { Context as vmContext } from 'vm';
import { Modules, ModuleData, ModuleRemoteConfig, ModuleLoaderOption } from 'types/module';

interface MutableRefObject<T> {
  current: T;
}

type FormatModuleData = (ModuleRemoteConfig & { styles?: string[] }) | Extract<ModuleData, Function>;

type Lifecycles = {
  bootstrap: (vue: VueConstructor, args?: ModuleRemoteConfig['args']) => void;
  // mount: () => void;
  // unmount: () => void;
};

/** 格式化模块配置 */
function formatModules(modules: Modules, errorCallback: ModuleLoaderOption['error'] = () => {}): FormatModuleData[] {
  if (Array.isArray(modules)) {
    return modules.reduce((prev, curr) => [...prev, ...formatModules(curr)], [] as FormatModuleData[]);
  } else if (isPlainObject(modules)) {
    const _modules = modules as Dictionary<any>;
    // no lib name
    if (_modules.entry && typeof _modules.entry === 'string') {
      return [
        {
          ...modules,
          styles: _modules.styles ? (!Array.isArray(_modules.styles) ? [_modules.styles] : _modules.styles) : [],
        } as FormatModuleData,
      ];
    } else {
      return Object.keys(_modules).map((moduleName) =>
        typeof _modules[moduleName] === 'string'
          ? {
              entry: _modules[moduleName],
              moduleName,
            }
          : {
              ..._modules[moduleName],
              styles: _modules[moduleName].styles
                ? !Array.isArray(_modules[moduleName].styles)
                  ? [_modules[moduleName].styles]
                  : _modules[moduleName].styles
                : [],
              moduleName,
            },
      );
    }
  } else if (isFunction(modules)) {
    return [modules];
  } else {
    errorCallback(`not support "${typeof modules}" type module`, modules);
    return [];
  }
}

/** 校验子应用导出的 生命周期 对象是否正确 */
function validateExportLifecycle(exports: any) {
  // export default function(){} 兼容处理
  const _export = (exports && exports.default) || exports;
  if (isFunction(_export)) {
    return true;
  } else {
    // 生命周期
    // todo: 延迟加载
    // const { bootstrap ，mount, unmount} = exports ?? {};
    // return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
    const { bootstrap } = exports || {};
    return isFunction(bootstrap);
  }
}

/** 获取生命周期对象 */
function getLifecyclesFromExports(scriptExports: any, moduleName: string, global: WindowProxy | vmContext): Lifecycles {
  if (validateExportLifecycle(scriptExports)) {
    const _export = (scriptExports && scriptExports.default) || scriptExports;
    return isFunction(_export) ? { bootstrap: _export } : scriptExports;
  }

  globalWarn(
    process.env.NODE_ENV === 'production',
    `[moduleLoader] lifecycle not found from ${moduleName} entry exports, fallback to get from window['${moduleName}']`,
  );

  // fallback to global variable who named with ${moduleName} while module exports not found
  const globalVariableExports = global.exports ? global.exports[moduleName] : global[moduleName];

  if (validateExportLifecycle(globalVariableExports)) {
    const _export = (globalVariableExports && globalVariableExports.default) || globalVariableExports;
    return isFunction(_export) ? { bootstrap: _export } : globalVariableExports;
  }

  throw new Error(`[moduleLoader] You need to export lifecycle functions in ${moduleName} entry`);
}

export default (Vue: VueConstructor, status: MutableRefObject<boolean>) => {
  return function loader(this: unknown, modules: Modules, opts: ModuleLoaderOption = {}): Promise<void> {
    const {
      sync,
      success,
      error = (msg: string) => {
        globalError(true, msg);
      },
    } = opts;

    status.current = false;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this;
    const _modules = formatModules(modules, error);

    // 按顺序同步执行
    if (sync === true) {
      return new Promise((resolve) =>
        schedule(0, () => {
          status.current = true;
          success ? success() : resolve();
        }),
      );
    } else {
      return new Promise((resolve) =>
        Promise.all(_modules.map((module) => exec(module))).then(() => {
          status.current = true;
          success ? success() : resolve();
        }),
      );
    }

    function exec(module: FormatModuleData) {
      // local module
      if (isFunction(module)) {
        const result = module.call(_self, Vue);
        if (result && result instanceof Promise) {
          return result;
        }
        return Promise.resolve();
      }
      // remote module
      else {
        const { moduleName, entry, styles = [], args } = module;
        // server render
        if (Vue.prototype.$isServer) {
          const global = ssr.createSandbox();

          return ssr
            .execScript(entry, global)
            .then((scriptExports: any) => {
              const { bootstrap } = getLifecyclesFromExports(scriptExports, moduleName, global);
              bootstrap.call(_self, Vue, args);
            })
            .catch((err: Error) => {
              // 异常不阻止当前执行，error 中处理
              try {
                error(err.message, module);
              } catch {}
            });
        } else {
          // todo: load in sandbox
          const global: WindowProxy = window;

          if (!global.Vue) {
            global.Vue = Vue;
          }

          // load styles
          spa.execStyles(styles, moduleName);

          // exec script
          return spa
            .execScript(entry, global)
            .then((scriptExports: any) => {
              const { bootstrap } = getLifecyclesFromExports(scriptExports, moduleName, global);
              bootstrap.call(_self, Vue, args);
            })
            .catch((err: Error) => {
              // 异常不阻止当前执行，error 中处理
              try {
                error(err.message, module);
              } catch {}
            });
        }
      }
    }

    function schedule(index: number, resolve: () => void) {
      if (index < _modules.length) {
        exec(_modules[index]).then(() => {
          schedule(index + 1, resolve);
        });
      } else {
        resolve();
      }
    }
  };
};
