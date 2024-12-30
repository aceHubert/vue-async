import warning from 'warning';
import { isArray, isFunction } from '@ace-util/core';
import { debug } from '../env';
import { promisify } from '../utils/promisify';

// Types
import { Vue2, App } from 'vue-demi';
import {
  ErrorHandler,
  InnerRegistrableModule,
  InnerRegisterSubModule,
  Lifecycle,
  RegisterProperties,
  Resolver,
} from '../types';
import { Bootstrap, Mount, Unmount } from '../sub/types';

type SubModuleExportLifecycles = {
  bootstrap?: Bootstrap;
  mount?: Mount;
  unmount?: Unmount;
};

/** 校验子应用导出的 生命周期 对象是否正确 */
function validateExportLifecycle(exports: any) {
  // export default function(){} 兼容处理
  const _export = (exports && exports.default) || exports;
  if (isFunction(_export)) {
    return true;
  } else {
    // 生命周期
    const { bootstrap, mount, unmount } = exports ?? {};
    return (!bootstrap || isFunction(bootstrap)) && (!mount || isFunction(mount)) && (!unmount || isFunction(unmount));
  }
}

/** 获取生命周期对象 */
function getLifecyclesFromExports(scriptExports: any, name: string, global: any): SubModuleExportLifecycles {
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
function execLifecycle(lifecycles: Lifecycle | Lifecycle[], module: InnerRegistrableModule) {
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
 * @param resolver resolver
 */
export function createModuleLoader<Context>(App: App | typeof Vue2, resolver: Resolver<Context>) {
  return function loader(
    /**
     * @internal
     */
    this: unknown,
    subModules: InnerRegisterSubModule[],
    {
      sync = false,
      errorHandlers = [],
      register,
    }: {
      sync?: boolean;
      errorHandlers?: ErrorHandler[];
      register?: (options: RegisterProperties) => void | (() => void);
    },
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this,
      context = resolver.getContext();

    return new Promise((resolve) => {
      // 按顺序同步执行
      if (sync === true) {
        schedule(0, resolve);
      } else {
        Promise.all(subModules.map(exec)).then(() => resolve());
      }
    });

    async function exec(module: InnerRegisterSubModule) {
      const lifecycles = module.lifecycles;
      // functional module
      if (isFunction(module.config)) {
        try {
          // before load lifycycle
          await execLifecycle(lifecycles.beforeLoad!, module.config);
          // local functional module
          const registerProperties = await promisify(module.config.call(_self, App));
          // exec in unmount
          let unregister: void | (() => void);
          // build mount function
          const execMount = async () => {
            // before mount lifecycle
            await execLifecycle(lifecycles.beforeMount!, module.config);
            // no mount lifecycle
            warning(!debug, 'functional module has no mount lifecycle and only execute once until app unmount!');
            // works on exectued functional module result
            if (registerProperties) {
              unregister = register?.(registerProperties);
            }
            // after mount lifecyle
            await execLifecycle(lifecycles.afterMount!, module.config);
          };

          // exec mount
          await execMount();

          // build unmount function
          const execUnmount = async () => {
            // before unmount lifecycle
            await execLifecycle(lifecycles.beforeUnmount!, module.config);
            // no unmount lifecycle
            warning(!debug, 'functional module has no unmount lifecycle and only execute once until app unmount!');
            // unregister function result
            unregister?.();
            // after unmount lifecycle
            await execLifecycle(lifecycles.afterUnmount!, module.config);
          };

          module.mount = execMount;
          module.unmount = execUnmount;
        } catch (err: any) {
          errorHandlers.forEach((handler) => {
            // 异常不阻止当前执行，error 中处理
            try {
              handler(err, module.config);
            } catch {}
          });
        }
      } else {
        // remote module
        const {
          config: { name, entry, styles = [], props = {} },
        } = module;

        try {
          // before load lifycycle
          await execLifecycle(lifecycles.beforeLoad!, module.config);
          // exec script
          const scriptExports = await promisify(resolver.execScript(entry));
          // get sub module lifecycle functions
          const {
            bootstrap,
            mount: exportMount,
            unmount: exportUnmount,
          } = getLifecyclesFromExports(scriptExports, name, context);
          // bootstrap only exec in the first time
          await promisify(bootstrap?.call(_self, App));
          // exec in unmount
          let unregister: void | (() => void);
          // build mount function
          const execMount = async () => {
            // before mount lifecycle
            await execLifecycle(lifecycles.beforeMount!, module.config);
            // add named styles
            await promisify(resolver.addStyles(styles));
            // exec mount
            const registerProperties = await promisify(exportMount?.call(_self, App, props));
            // works on exectued mount function result
            if (registerProperties) {
              unregister = register?.(registerProperties);
            }
            // set activated
            module.activated = true;
            // after mount lifecyle
            await execLifecycle(lifecycles.afterMount!, module.config);
          };
          // exec mount
          await execMount();

          // set warn "unmount" unsupport
          warning(!exportUnmount, 'Vue2 is not support "unmount" lifecycle');

          // build unmount function
          const execUnmount = async () => {
            // before unmount lifecycle
            await execLifecycle(lifecycles.beforeUnmount!, module.config);
            // remove named styles
            await promisify(resolver.removeStyles(styles));
            // exec unmount
            await promisify(exportUnmount?.call(_self, App, props));
            // unregister function result
            unregister?.();
            // set unactivated
            module.activated = false;
            // after unmount lifecycle
            await execLifecycle(lifecycles.afterUnmount!, module.config);
          };

          module.mount = execMount;
          module.unmount = execUnmount;
        } catch (err: any) {
          errorHandlers.forEach((handler) => {
            // 异常不阻止当前执行，error 中处理
            try {
              handler(err, module.config);
            } catch {}
          });
        }
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
