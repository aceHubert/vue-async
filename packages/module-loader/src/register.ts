import { getCurrentInstance, inject, isVue2 } from 'vue-demi';
import { isArray, isPlainObject, isFunction, isUndef } from '@ace-util/core';
import { getLocation, compilePathRegex } from './utils/path';
import { debug } from './env';

// Types
import type { App, InjectionKey, Component } from 'vue-demi';
import type {
  ModuleLoader,
  ModuleLoaderOptions,
  RegistrableModule,
  InnerRegisterSubModule,
  InnerRegistrableModule,
  ModuleRemoteConfig,
  Lifecycles,
  Router,
  ErrorHandler,
} from './types';

/**
 * activeLoader must be called to handle SSR at the top of functions like
 * `fetch`, `setup`, `serverPrefetch` and others
 */
let activeLoader: ModuleLoader | undefined;

/**
 * Global options
 */
const loaderOptions: ModuleLoaderOptions = {
  sync: false,
};

/**
 * Global error handlers
 */
const errorHandlers: ErrorHandler[] = [];

/**
 * inject key
 */
export const ModuleLoaderSymbol: InjectionKey<ModuleLoader> = debug
  ? Symbol.for('__VUE_ASYNC_MODULE_LOADER__')
  : Symbol();

/**
 * Set or unset active fetch, Used in SSR and internally when calling
 * actions and getters
 * @param loader ModuleLoader instance
 */
export const setActiveLoader = (loader: ModuleLoader | undefined) => (activeLoader = loader);

/**
 * Get the currently active fetch if there is any.
 */
export const getActiveLoader = () => (getCurrentInstance() && inject(ModuleLoaderSymbol)) || activeLoader;

/**
 * Set ModuleLoader options
 * @param options Options
 */
export function setOptions(options: ModuleLoaderOptions) {
  Object.assign(loaderOptions, options);
}

/**
 * Add global error handler
 * @param handler Error handler
 */
export function addErrorHandler(handler: ErrorHandler): void {
  errorHandlers.push(handler);
}

/**
 * Remove global error handler
 * @param handler Error handler
 */
export function removeErrorHandler(handler: ErrorHandler): void {
  let index = -1;
  if ((index = errorHandlers.findIndex((h) => h === handler)) >= 0) {
    errorHandlers.splice(index, 1);
  }
}

/**
 * Register sub modules
 * @param config module config
 * @param lifecycles lifecycle
 */
export function registerSubModules(config: RegistrableModule | RegistrableModule[], lifecycles?: Lifecycles) {
  const subModuleConfigs: InnerRegisterSubModule[] = [],
    innerLifecycles: InnerRegisterSubModule['lifecycles'] = {};

  if (lifecycles) {
    const keys = Object.keys(lifecycles) as (keyof Lifecycles)[];
    keys.forEach((name) => {
      name = name as keyof Lifecycles;
      const lifecycleFns = lifecycles[name];
      if (lifecycleFns) {
        if (!innerLifecycles[name]) {
          innerLifecycles[name] = [];
        }
        innerLifecycles[name]!.push(...(isArray(lifecycleFns) ? lifecycleFns : [lifecycleFns]));
      }
    });
  }

  formatModules(config).map((config) => {
    let activeRule: InnerRegisterSubModule['activeRule'] = undefined;
    if (!isFunction(config) && !isUndef(config.activeRule)) {
      const activeRules = isArray(config.activeRule) ? config.activeRule : [config.activeRule!];
      activeRule = activeRules.map((rule) => {
        if (isFunction(rule)) {
          return rule;
        } else {
          return (location: Location) => {
            const path = getLocation(location);
            const regex = compilePathRegex(rule, {});
            return !!path.match(regex);
          };
        }
      });
    }
    subModuleConfigs.push({ config, lifecycles: innerLifecycles, activeRule, activated: false });
  });

  function useLoader(loader?: ModuleLoader) {
    const currentInstance = getCurrentInstance();
    loader = loader || (currentInstance && inject(ModuleLoaderSymbol)) || undefined;

    if (loader) setActiveLoader(loader);

    if (debug && !activeLoader) {
      throw new Error(
        `getActiveLoader was called with no active loader. Did you forget to install loader?\n` +
          `\tconst moduleLoader = createLoader()\n` +
          (isVue2 ? `\tVue.use(ModuleLoaderVuePlugin)\nnew Vue({ moduleLoader })\n` : `\tapp.use(moduleLoader)\n`) +
          `This will fail in production.`,
      );
    }

    loader = activeLoader!;

    return {
      start: (options?: ModuleLoaderOptions & { router?: Router }) =>
        execute(loader!._moduleLoader, subModuleConfigs, Object.assign({}, loaderOptions, options), loader!._a),
    };

    /**
     * 执行模块加载
     * @param moduleLoader module loader
     * @param subModuleConfigs module configs
     * @param router vue-router
     * @param app vue instance
     */
    async function execute(
      moduleLoader: ModuleLoader['_moduleLoader'],
      subModuleConfigs: InnerRegisterSubModule[],
      options: ModuleLoaderOptions & { router?: Router },
      app?: App,
    ) {
      // 加载模块
      const loader = async (needAcivateSubModules: InnerRegisterSubModule[]) => {
        // show loading
        const stopLoading = options.loading?.('mount');
        // 执行已经加载的模块 mount
        await Promise.all(needAcivateSubModules.map((module) => module.mount?.()));
        // 执行未加载的模块
        await moduleLoader(
          needAcivateSubModules.filter((module) => !module.mount),
          {
            sync: options.sync,
            register: options.register,
            errorHandlers,
          },
        );
        // hide loading
        stopLoading?.();
      };

      // 卸载模块
      const unloader = async (needUnactivateSubModules: InnerRegisterSubModule[]) => {
        // show loading
        const stopLoading = options.loading?.('unmount');
        // 执行模块 unmount
        await Promise.all(needUnactivateSubModules.map((module) => module.unmount?.()));
        // hide loading
        stopLoading?.();
      };

      // 加载未设置 activeRule 的模块
      await loader(subModuleConfigs.filter(({ activeRule }) => !activeRule));

      if (app) {
        const originalUnmount = app.unmount;
        // 卸载未设置 activeRule 的模块
        app.unmount = async function () {
          await unloader(subModuleConfigs.filter(({ activeRule }) => !activeRule));
          originalUnmount();
        };
      }

      // 按 activeRule 规则加载模块
      if (options.router) {
        // 使用 vue-router
        options.router.beforeEach(async (to, from, next) => {
          const needAcivateSubModules = subModuleConfigs.filter(
            ({ activeRule, activated }) =>
              activated !== true && activeRule && activeRule.some((rule) => rule(window.location)),
          );

          if (!needAcivateSubModules.length) return next();

          await loader(needAcivateSubModules);

          next();
        });

        options.router.afterEach(async (to, from) => {
          const needUnactivateSubModules = subModuleConfigs.filter(
            ({ activeRule, activated, unmount }) =>
              activated === true && !!unmount && activeRule && !activeRule.some((rule) => rule(window.location)),
          );
          if (!needUnactivateSubModules.length) return;

          await unloader(needUnactivateSubModules);
        });
      } else if (window.addEventListener) {
        // 使用 window.location
        const popStateHandler = async () => {
          const needAcivateSubModules = subModuleConfigs.filter(
            ({ activeRule, activated }) =>
              activated !== true && activeRule && activeRule.some((rule) => rule(window.location)),
          );

          await loader(needAcivateSubModules);
        };

        const beforeUnloadListener = async () => {
          const needUnactivateSubModules = subModuleConfigs.filter(
            ({ activeRule, activated, unmount }) =>
              activated === true && !!unmount && activeRule && !activeRule.some((rule) => rule(window.location)),
          );
          await unloader(needUnactivateSubModules);
        };

        window.addEventListener('popstate', popStateHandler);
        window.addEventListener('beforeunload', beforeUnloadListener);
      }
    }
  }

  return useLoader;
}

/**
 * Register components
 * @param config component config
 */
export function registerComponents<T extends Record<string, string | { src: string; styles?: string | string[] }>>(
  config: T,
) {
  const _components = new Map<string, Component>();

  function useLoader(loader?: ModuleLoader) {
    const currentInstance = getCurrentInstance();
    loader = loader || (currentInstance && inject(ModuleLoaderSymbol)) || undefined;

    if (loader) setActiveLoader(loader);

    if (debug && !activeLoader) {
      throw new Error(
        `getActiveLoader was called with no active loader. Did you forget to install loader?\n` +
          `\tconst moduleLoader = createLoader()\n` +
          (isVue2 ? `\tVue.use(ModuleLoaderVuePlugin)\nnew Vue({ moduleLoader })\n` : `\tapp.use(moduleLoader)\n`) +
          `This will fail in production.`,
      );
    }

    loader = activeLoader!;

    const components = Object.keys(config).reduce((prev, componentName) => {
      prev[componentName as keyof T] = async () => {
        let params = config[componentName];
        if (typeof params === 'string') {
          params = { src: params };
        }

        if (!_components.has(componentName)) {
          await loader!._componentLoader
            .apply(null, [componentName, params.src, params.styles])
            .then((component) => _components.set(componentName, component));
        }

        return _components.get(componentName)!;
      };
      return prev;
    }, {} as Record<keyof T, () => Promise<Component>>);

    return components;
  }

  return useLoader;
}

/**
 * Format module config from user input
 * @param config user input module config
 * @returns start loader
 */
function formatModules(config: RegistrableModule | RegistrableModule[]): InnerRegistrableModule[] {
  if (isArray(config)) {
    return config.reduce((prev, curr) => [...prev, ...formatModules(curr)], [] as InnerRegistrableModule[]);
  } else if (isPlainObject(config)) {
    let configObj = config as Exclude<RegistrableModule, Function>;
    // no lib name, { name: 'module name', entry: 'entry script'}
    if (configObj.entry && typeof configObj.entry === 'string') {
      const { styles, name, props, ...rest } = configObj as ModuleRemoteConfig;
      return [
        {
          ...rest,
          name,
          styles: styles ? (!Array.isArray(styles) ? [styles] : styles) : [],
          props,
        } as InnerRegistrableModule,
      ];
    } else {
      //{ 'module name': 'entry script' | {entry: 'entry script'}}
      return Object.keys(configObj).map((name) => {
        const value = (configObj as Record<string, string | Omit<ModuleRemoteConfig, 'moduleName'> | 'name'>)[name];
        if (typeof value === 'string') {
          return {
            name,
            entry: value,
          };
        } else {
          const { styles, props, ...rest } = value;
          return {
            ...rest,
            name,
            styles: styles ? (!Array.isArray(styles) ? [styles] : styles) : [],
            props,
          };
        }
      });
    }
  } else if (isFunction(config)) {
    return [config];
  } else {
    const err = new Error(`not support "${typeof config}" type module`);
    try {
      errorHandlers.forEach((hander) => {
        hander(err, config);
      });
    } catch {}
    return [];
  }
}
