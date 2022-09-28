/**
 * moduleLoader
 */
import warning from 'warning';
import { isPlainObject, isArray, isFunction } from '@vue-async/utils';
import * as spa from '../utils/spa';
// import * as ssr from '../utils/ssr';

// Types
import { VueConstructor } from 'vue';
import { Context as vmContext } from 'vm';
import { ModuleConfig, ModuleRemoteConfig, ModuleLoaderOptions } from 'types/module';
import { Bootstrap } from 'types/sub';

interface MutableRefObject<T> {
  current: T;
}

type FormatModuleData = (ModuleRemoteConfig & { styles?: string[] }) | Extract<ModuleConfig, Function>;

type Lifecycles = {
  bootstrap: Bootstrap;
  // mount: () => void;
  // unmount: () => void;
};

const noop = () => {};

function promisify<T = any>(promise: T | PromiseLike<T>): Promise<T> {
  if (promise && promise instanceof Promise && typeof promise.then === 'function') {
    return promise;
  }
  return Promise.resolve(promise);
}

/** 格式化模块配置 */
function formatModules(
  config: ModuleConfig | ModuleConfig[],
  errorCallback: ModuleLoaderOptions['error'] = () => {},
): FormatModuleData[] {
  if (Array.isArray(config)) {
    return config.reduce((prev, curr) => [...prev, ...formatModules(curr)], [] as FormatModuleData[]);
  } else if (isPlainObject(config)) {
    const _modules = config as Dictionary<any>;
    // no lib name
    if (_modules.entry && typeof _modules.entry === 'string') {
      return [
        {
          ...config,
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
  } else if (isFunction(config)) {
    return [config];
  } else {
    errorCallback(`not support "${typeof config}" type module`, config);
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

  warning(
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
  return function loader(
    this: unknown,
    config: ModuleConfig | ModuleConfig[],
    options: ModuleLoaderOptions = {},
  ): Promise<void> {
    const {
      sync,
      register = noop,
      onLoading = noop,
      onLoaded = noop,
      onError = (name, error) => {
        warning(false, `An error occurred while loading module "${name}", Error: ${error.message}`);
      },
      success,
      error,
    } = options;

    status.current = false;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this;
    const _modules = formatModules(config, error);

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

    async function exec(module: FormatModuleData) {
      // local module
      if (isFunction(module)) {
        const bootstrapResult = await promisify(module.call(_self, Vue));
        if (bootstrapResult) {
          let result = {};
          if (isArray(bootstrapResult)) {
            result = {
              routes: bootstrapResult,
            };
          } else {
            result = bootstrapResult;
          }
          register(result);
        }
      }
      // remote module
      else {
        const { moduleName, entry, styles = [], args } = module;
        // server render
        // if (Vue.prototype.$isServer) {
        //   const global = ssr.createSandbox();

        //   return ssr
        //     .execScript(entry, global)
        //     .then((scriptExports: any) => {
        //       const { bootstrap } = getLifecyclesFromExports(scriptExports, moduleName, global);
        //       bootstrap.call(_self, Vue, args);
        //     })
        //     .catch((err: Error) => {
        //       // 异常不阻止当前执行，error 中处理
        //       try {
        //         error(err.message, module);
        //       } catch {}
        //     });
        // } else {
        // todo: load in sandbox
        const global: WindowProxy = window;

        if (!global.Vue) {
          global.Vue = Vue;
        }

        try {
          // load styles
          await spa.execStyles(styles, moduleName);

          // exec script
          const scriptExports = await spa.execScript(entry, global);
          await promisify(onLoading(moduleName));
          const { bootstrap } = getLifecyclesFromExports(scriptExports, moduleName, global);
          const bootstrapResult = await promisify(bootstrap.call(_self, Vue, args));
          if (bootstrapResult) {
            let result = {};
            if (isArray(bootstrapResult)) {
              result = {
                routes: bootstrapResult,
              };
            } else {
              result = bootstrapResult;
            }
            register(result);
          }
          await promisify(onLoaded(moduleName));
        } catch (err: any) {
          // 异常不阻止当前执行，error 中处理
          try {
            await promisify(onError(moduleName, err));
            // 方法已过时
            if (error && typeof error === 'function') {
              // eslint-disable-next-line no-console
              console.warn('"error" function is deprecated, using "onError" function!');
              error(err.message, module);
            }
          } catch {}
        }
        // }
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
