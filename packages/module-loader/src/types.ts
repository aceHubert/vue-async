import * as VueDemi from 'vue-demi';
import { RouteRecordRaw } from 'vue-router';
import { Module, ModuleOptions } from 'vuex';

class Helper<Props> {
  Return = VueDemi.defineComponent({} as { props: Record<keyof Props, any> });
}

export type DefineComponent<Props> = Helper<Props>['Return'];

/**
 * Inject result
 */
export type InjectResult = {
  has(functionToCheck?: Function | boolean): Function | boolean;
  remove(functionToRemove: Function, priority?: number): boolean;
  removeAll(priority: boolean | number): void;
  filter<T = unknown, R = T>(value: T, ...args: unknown[]): Promise<R>;
  exec(...args: unknown[]): Promise<void>;
};

/**
 * Inject
 */
export interface InjectFunction {
  /**
   * 执行 inject 方法
   */
  (tag: string): InjectResult;
  /**
   * 注入 inject 方法
   */
  (tag: string, functionToAdd: Function, priority?: number, acceptedArgs?: number): void;
}

export interface RegisterOptions {
  routes?: RouteRecordRaw[];
  stores?: Record<string, Module<any, any> | [Module<any, any>, ModuleOptions]>;
  injects?: Record<
    string,
    | Function
    | [
        Function,
        {
          priority?: number;
          acceptedArgs?: number;
        },
      ]
  >;
  [key: string]: any;
}

/**
 * Main module loader typings
 */

export type ModuleLoaderOptions = {
  /**
   * 是否同步加载子模块，默认为false
   * @internal 不使用同步方法了
   */
  sync?: boolean;
  /**
   * 模块加载时显示加载中
   * 返回如果是函数则在执行完成时调用
   */
  loading?: (lifecycle: 'mount' | 'unmount') => void | (() => void);
  /**
   * 子应用返回的配置需要注册到主应用上
   * 返回如果是函数则卸载前调用
   */
  register?: (options: RegisterOptions) => void | (() => void);
};

/**
 * @deprecated 使用 'ModuleLoaderOptions'
 */
export type DeprecatedModuleLoaderOptions = {
  /**
   * 模块是否按同步方式执行加载
   */
  sync?: true;
  /**
   * 模块加载前
   */
  onLoading?: (name: string) => void | Promise<void>;
  /**
   * 模块加载成功
   */
  onLoaded?: (name: string) => void | Promise<void>;
  /**
   * 模块加载失败
   */
  onError?: (name: string, error: Error) => void | Promise<void>;
  /**
   * @deprecated 所有模块加载成功时
   */
  success?: () => void;
  /**
   *  @deprecated 模块加载失败时
   */
  error?: (msg: string, module?: any) => void; // every single module loaded error with message, module: formated module config
};

/**
 * 远程模块配置
 */
export type ModuleRemoteConfig = {
  /**
   * @deprecated 使用 `name` 字段
   */
  moduleName?: string;
  /**
   * 模块名（子模块打包时挂载到 global 上的名字）
   */
  name: string;
  /**
   * 入口 script 地址
   */
  entry: string;
  /**
   * 样式文件（例如使用 ExtractTextPlugin 插件将css文件独立找包时）
   */
  styles?: string | string[];
  /**
   * 激活子模块条件
   */
  activeRule?: string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>;
  /**
   * @deprecated 使用 `props` 字段
   */
  args?: Record<string, any>;
  /**
   * 参数，用于传递给 mount 和 unmount 生命周期的第2个参数
   */
  props?: Record<string, any>;
};

/**
 * 函数模块
 * 方法体相当于 remote module -> bootstrap 生命周期
 * 方法返回相当于 remote module -> unmount 生命周期, 仅在Vue3中生效效
 */
export type FunctionalModule = (
  App: VueDemi.App | typeof VueDemi.Vue2,
) => void | (() => void | Promise<void>) | Promise<void | (() => void | Promise<void>)>;

/**
 * 注册模块配置
 */
export type RegistrableModule =
  | ModuleRemoteConfig
  | Record<string, string | Omit<ModuleRemoteConfig, 'moduleName' | 'name'>>
  | FunctionalModule;

/**
 * 格式化后的模块配置
 */
export type FixedRegistrableModule =
  | (Omit<ModuleRemoteConfig, 'moduleName' | 'args' | 'styles'> & { styles?: string[] })
  | FunctionalModule;

export type Lifecycle = (module: FixedRegistrableModule) => void;

export type Lifecycles = {
  /**
   * 执行子模块 bootstrap 生命周期之前
   */
  beforeLoad?: Lifecycle | Array<Lifecycle>;
  /**
   * 执行子模块 mount 生命周期之前
   */
  beforeMount?: Lifecycle | Array<Lifecycle>;
  /**
   * 执行子模块 mount 生命周期之后
   */
  afterMount?: Lifecycle | Array<Lifecycle>;
  /**
   * 执行子模块 unmount 生命周期之前
   */
  beforeUnmount?: Lifecycle | Array<Lifecycle>;
  /**
   * 执行子模块 unmount 生命周期之后
   */
  afterUnmount?: Lifecycle | Array<Lifecycle>;
};

/**
 * 异常处理函数
 */
export type ErrorHandler = (error: Error, module: FixedRegistrableModule) => void;

/**
 * Event bus
 */
export type EventBus = {
  emit(eventName: string, playload: any): void;
  on(eventName: string, handler: (playload: any) => void): void;
  off(eventName: string, handler: (playload: any) => void): void;
  clear(): void;
  getEvents(): Record<string, any>;
};

export interface ModuleLoader {
  /**
   * Install fetch plugin
   */
  install: (app: VueDemi.App) => void;
}
