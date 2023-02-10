/**
 * moduleLoader
 */
import warning from 'warning';
import { isArray, isPlainObject, isFunction } from '@vue-async/utils';
import { debug } from '../env';
import * as spa from '../utils/spa';
// import * as ssr from '../utils/ssr';

// Types
import { isVue2, Vue2, App } from 'vue-demi';
import { Module, ModuleOptions } from 'vuex';
import { Context as vmContext } from 'vm';
import { RegisterSubModule } from '../register';
import { ErrorHandler, FixedRegistrableModule, Lifecycle, Lifecycles, RegisterOptions } from '../types';
import { Bootstrap, Mount, Unmount } from 'type-sub';

type SubModuleExportLifecycles = {
  bootstrap: Bootstrap;
  mount?: Mount;
  unmount?: Unmount;
};

function promisify<T>(promise: T | PromiseLike<T>): Promise<T> {
  if (promise && promise instanceof Promise && typeof promise.then === 'function') {
    return promise;
  }
  return Promise.resolve(promise);
}

/** 校验子应用导出的 生命周期 对象是否正确 */
function validateExportLifecycle(exports: any) {
  // export default function(){} 兼容处理
  const _export = (exports && exports.default) || exports;
  if (isFunction(_export)) {
    return true;
  } else {
    // 生命周期
    const { bootstrap, mount, unmount } = exports ?? {};
    return isFunction(bootstrap) && (!mount || isFunction(mount)) && (!unmount || isFunction(unmount));
  }
}

/** 获取生命周期对象 */
function getLifecyclesFromExports(
  scriptExports: any,
  name: string,
  global: WindowProxy | vmContext,
): SubModuleExportLifecycles {
  if (validateExportLifecycle(scriptExports)) {
    const _export = (scriptExports && scriptExports.default) || scriptExports;
    return isFunction(_export) ? { bootstrap: _export } : scriptExports;
  }

  warning(
    !debug,
    `[@vue-async/module-loader] lifecycle not found from ${name} entry exports, fallback to get from window['${name}']`,
  );

  // fallback to global variable who named with ${name} while module exports not found
  const globalVariableExports = global.exports ? global.exports[name] : global[name];

  if (validateExportLifecycle(globalVariableExports)) {
    const _export = (globalVariableExports && globalVariableExports.default) || globalVariableExports;
    return isFunction(_export) ? { bootstrap: _export } : globalVariableExports;
  }

  throw new Error(`[@vue-async/module-loader] You need to export lifecycle functions in ${name} entry`);
}

/** 执行生命周期函数 */
function execLifecycle(lifecycles: Lifecycle | Lifecycle[], module: FixedRegistrableModule) {
  if (lifecycles) {
    if (isArray(lifecycles)) {
      return Promise.all(lifecycles.map((lifecycle) => promisify(lifecycle(module))));
    } else {
      return promisify(lifecycles(module));
    }
  }
  return Promise.resolve();
}

/**
 * create module loader
 * @param App instance from 'createApp' in Vue3, Vue constructor in Vue2
 */
export function createModuleLoader(App: App | typeof Vue2) {
  return function loader(
    /**
     * @internal
     */
    this: unknown,
    subModules: RegisterSubModule[],
    {
      sync = false,
      lifecycles = {},
      errorHanlders = [],
      register = () => {},
    }: {
      sync?: boolean;
      lifecycles?: Lifecycles;
      errorHanlders?: ErrorHandler[];
      register?: (options: RegisterOptions) => void | (() => void);
    },
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this;

    return new Promise((resolve) => {
      // 按顺序同步执行
      if (sync === true) {
        schedule(0, resolve);
      } else {
        Promise.all(subModules.map(exec)).then(() => resolve());
      }
    });

    async function exec(module: RegisterSubModule) {
      // functional module
      if (isFunction(module.config)) {
        // before load lifycycle
        await execLifecycle(lifecycles.beforeLoad!, module.config);
        // local module
        const unmount = await promisify(module.config.call(_self, App));

        // build mount function
        const execMount = async () => {
          // before mount lifecycle
          await execLifecycle(lifecycles.beforeMount!, module.config);
          // no mount lifecycle
          warning(!debug, 'functional module has no mount lifecycle and only execute once until app unmount!');
          // set activated
          module.activated = true;
          // after mount lifecyle
          await execLifecycle(lifecycles.afterMount!, module.config);
        };

        // exec mount
        await execMount();

        // set warn "unmount" unsupport
        warning(!unmount, 'Vue2 is not support functional module "unmount" lifecycle');

        // build unmount function
        const execUnmount = async () => {
          // before unmount lifecycle
          await execLifecycle(lifecycles.beforeUnmount!, module.config);
          // exec unmount
          await promisify(unmount?.call(_self));
          // set unactivated
          module.activated = false;
          // after unmount lifecycle
          await execLifecycle(lifecycles.afterUnmount!, module.config);
        };

        module.mount = execMount;
        module.unmount = execUnmount;
      } else {
        // remote module
        const {
          config: { name, entry, styles = [], props = {} },
        } = module;
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

        // browser render
        // TODO: load in sandbox
        const global: WindowProxy = window;

        // 如果是Vue2, 把 Vue constructor 入到全局 context 上供子模块使用
        if (!global.Vue && isVue2) {
          global.Vue = App;
        }

        try {
          // before load lifycycle
          await execLifecycle(lifecycles.beforeLoad!, module.config);
          // exec script
          const scriptExports = await spa.execScript(entry, global);
          // get sub module lifecycle functions
          const {
            bootstrap,
            mount: exportMount,
            unmount: exportUnmount,
          } = getLifecyclesFromExports(scriptExports, name, global);
          // bootstrap only exec in the first time
          await promisify(bootstrap.call(_self, App));
          // unmount functions
          let unregister: ReturnType<typeof register>;
          // build mount function
          const execMount = async () => {
            // before mount lifecycle
            await execLifecycle(lifecycles.beforeMount!, module.config);
            // add named styles
            await spa.addStyles(styles, name);
            // exec mount
            const mountResult = await promisify(exportMount?.call(_self, App, props));
            // works on exectued mount function result
            if (isArray(mountResult)) {
              // 注册 routes
              unregister = register({ routes: mountResult });
            } else if (isPlainObject(mountResult)) {
              unregister = register(mountResult);
              const { routes, stores, injects } = mountResult;
              // 注册 routes
              routes?.length && (removeRoutes = addRoutes(routes));

              // 注册 store
              let storeModulePaths: string[];
              if ((storeModulePaths = Object.keys(stores || {})) && storeModulePaths.length) {
                const unregisterStoreMap = storeModulePaths.map((path) => {
                  const args = stores![path];
                  return registerStore.apply(null, [path, ...(isArray(args) ? args : [args])] as [
                    string,
                    Module<any, any>,
                    ModuleOptions | undefined,
                  ]);
                });

                unregisterStore = () => {
                  unregisterStoreMap.forEach((fn) => {
                    isFunction(fn) && fn();
                  });
                };
              }

              // 注册 injects
              let injectTags: string[];
              if ((injectTags = Object.keys(injects || {})) && injectTags.length) {
                const unregisterInjectMap = injectTags.map((tag) => {
                  const args = injects![tag];
                  return registerInject.apply(null, [tag, ...(isArray(args) ? args : [args])] as [
                    string,
                    Function,
                    (
                      | {
                          priority?: number;
                          acceptedArgs?: number;
                        }
                      | undefined
                    ),
                  ]);
                });

                unregisterInject = () => {
                  unregisterInjectMap.forEach((fn) => {
                    isFunction(fn) && fn();
                  });
                };
              }
            }
            // set activated
            module.activated = true;
            // after mount lifecyle
            await execLifecycle(lifecycles.afterMount!, module.config);
          };
          // exec mount
          await execMount();
          // build unmount function
          const execUnmount = async () => {
            // before unmount lifecycle
            await execLifecycle(lifecycles.beforeUnmount!, module.config);
            // remove named styles
            spa.removeStyles(name);
            // exec unmount
            await promisify(exportUnmount?.call(_self, App, props));
            // 卸载 routes
            isFunction(removeRoutes) && removeRoutes();
            // 卸载 store
            isFunction(unregisterStore) && unregisterStore();
            // 卸载 inject 注入
            isFunction(unregisterInject) && unregisterInject();
            // set unactivated
            module.activated = false;
            // after unmount lifecycle
            await execLifecycle(lifecycles.afterUnmount!, module.config);
          };

          module.mount = execMount;
          module.unmount = execUnmount;
        } catch (err: any) {
          errorHanlders.forEach((handler) => {
            // 异常不阻止当前执行，error 中处理
            try {
              handler(err, module.config);
            } catch {}
          });
        }
        // }
      }
    }

    function schedule(index: number, resolve: () => void) {
      if (index < subModules.length) {
        exec(subModules[index]).then((unmount) => {
          schedule(index + 1, resolve);
        });
      } else {
        resolve();
      }
    }
  };
}
