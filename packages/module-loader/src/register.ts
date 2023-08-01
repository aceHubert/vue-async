import { isArray, isPlainObject, isFunction, isUndef } from '@ace-util/core';
import { getLocation, compilePathRegex } from './utils/path';

// Types
import {
  ModuleLoaderOptions,
  RegistrableModule,
  FixedRegistrableModule,
  ModuleRemoteConfig,
  Lifecycle,
  Lifecycles,
  ErrorHandler,
} from './types';

export type RegisterSubModule = {
  /**
   * 模块原始被格式化后的配置
   */
  config: FixedRegistrableModule;
  /**
   * 格式化后的激活条件
   */
  activeRule: ((location: Location, base: string) => boolean)[]; // formated active rule
  /**
   * 当前激活状态
   */
  activated: boolean;
  /**
   * 加载script 缓存 mount 函数
   */
  mount?: () => Promise<void>;
  /**
   * 加载script 缓存 unmount 函数
   */
  unmount?: () => Promise<void>;
};

export const moduleLoaderOptions: ModuleLoaderOptions = {
  sync: false,
};

export function setModuleLoaderOptions(options: ModuleLoaderOptions) {
  Object.assign(moduleLoaderOptions, options);
}

/** 子模块配置注入 */
export const subModuleConfigs: RegisterSubModule[] = []; // registered modules

export const loaderLifecycles: {
  beforeLoad: Array<Lifecycle>;
  beforeMount: Array<Lifecycle>;
  afterMount: Array<Lifecycle>;
  beforeUnmount: Array<Lifecycle>;
  afterUnmount: Array<Lifecycle>;
} = {
  beforeLoad: [],
  beforeMount: [],
  afterMount: [],
  beforeUnmount: [],
  afterUnmount: [],
}; // lifecycles

// 格式化模块配置
function formatModules(config: RegistrableModule | RegistrableModule[]): FixedRegistrableModule[] {
  if (isArray(config)) {
    return config.reduce((prev, curr) => [...prev, ...formatModules(curr)], [] as FixedRegistrableModule[]);
  } else if (isPlainObject(config)) {
    let configObj = config as Exclude<RegistrableModule, Function>;
    // no lib name, { name: 'module name', entry: 'entry script'}
    if (configObj.entry && typeof configObj.entry === 'string') {
      const { styles, moduleName, name, args, props, ...rest } = configObj as ModuleRemoteConfig;
      return [
        {
          ...rest,
          name: name || moduleName,
          styles: styles ? (!Array.isArray(styles) ? [styles] : styles) : [],
          props: props || args,
        } as FixedRegistrableModule,
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
          const { styles, args, props, ...rest } = value;
          return {
            ...rest,
            name,
            styles: styles ? (!Array.isArray(styles) ? [styles] : styles) : [],
            props: props || args,
          };
        }
      });
    }
  } else if (isFunction(config)) {
    return [config];
  } else {
    const err = new Error(`not support "${typeof config}" type module`);
    try {
      errorHanlders.forEach((hander) => {
        hander(err, config);
      });
    } catch {}
    return [];
  }
}

// 合并lifecycles
function mergeLifecycles(lifecycles: Lifecycles) {
  Object.keys(lifecycles).forEach((name) => {
    const lifecycleFns = lifecycles[name as keyof Lifecycles];
    let existedLifecycleFns: Lifecycle[];
    if (lifecycleFns && (existedLifecycleFns = loaderLifecycles[name as keyof Lifecycles])) {
      existedLifecycleFns.push(...(isArray(lifecycleFns) ? lifecycleFns : [lifecycleFns]));
    }
  });
}

export function registerSubModules(modules: RegistrableModule | RegistrableModule[], lifecycles?: Lifecycles) {
  formatModules(modules).map((config) => {
    let activeRule: RegisterSubModule['activeRule'];
    if (isFunction(config) || isUndef(config.activeRule)) {
      activeRule = [() => true];
    } else {
      const activeRules = isArray(config.activeRule) ? config.activeRule : [config.activeRule!];
      activeRule = activeRules.map((rule) => {
        if (isFunction(rule)) {
          return rule;
        } else {
          return (location: Location, base = '/') => {
            const path = getLocation(location, base);
            const regex = compilePathRegex(rule, {});
            return !!path.match(regex);
          };
        }
      });
    }
    subModuleConfigs.push({ config, activeRule, activated: false });
  });

  lifecycles && mergeLifecycles(lifecycles);
}

/** 异常方法注入 */
export const errorHanlders: ErrorHandler[] = [];

export function addErrorHandler(handler: ErrorHandler): void {
  errorHanlders.push(handler);
}

export function removeErrorHandler(handler: ErrorHandler): void {
  let index = -1;
  if ((index = errorHanlders.findIndex((h) => h === handler)) >= 0) {
    errorHanlders.splice(index, 1);
  }
}
