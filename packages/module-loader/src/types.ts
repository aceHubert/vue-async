import type { App, Vue2, Component } from 'vue-demi';

export interface ModuleLoader<Props extends Record<string, any> = any, Context = any> {
  /**
   * Alias of export setModuleLoaderOptions
   */
  setOptions: (options: ModuleLoaderOptions<Props>) => ModuleLoader<Props, Context>;
  /**
   * Alias of export addErrorHandler
   */
  addErrorHandler: (handler: ErrorHandler) => ModuleLoader<Props, Context>;
  /**
   * Alias of export removeErrorHandler
   */
  removeErrorHandler: (handler: ErrorHandler) => ModuleLoader<Props, Context>;
  /**
   * Resolver
   */
  resolver: Resolver<Context>;
  /**
   * App linked to this ModuleLoader instance
   * @internal
   */
  _a: App;
  /**
   * Module loader executor
   * @internal
   */
  _moduleLoader: (
    subModules: InnerRegisterSubModule[],
    options: {
      sync?: boolean;
      register?: (options: RegisterProperties) => void | (() => void);
      errorHandlers?: ErrorHandler[];
    },
  ) => void;
  /**
   * Component loader executor
   * @internal
   */
  _componentLoader: <T>(componentName: string, src: string, styles?: string | string[]) => Promise<Component<T>>;
  /**
   * Install ModuleLoader plugin
   */
  install: (app: App) => void;
}

/**
 * Register options from submodule bootstrap return
 */
export interface RegisterProperties {
  [key: string]: any;
}

/**
 * Main module loader typings
 */
export type ModuleLoaderOptions<Props extends Record<string, any>> = {
  /**
   * Use sync mode to load submodules
   * @default false
   */
  sync?: boolean;
  /**
   * Global properties to pass to submodules,
   * set it before registerSubModules, otherwise it will not apply to submodules
   */
  props?: Props | (() => Props);
  /**
   * Loading shown,
   * return a function to hide loading
   */
  loading?: (lifecycle: 'mount' | 'unmount') => void | (() => void);
  /**
   * Register properties from sub module mount(functional module) return,
   * unregister in unmount if return a function
   */
  register?: (properties: RegisterProperties) => void | (() => void);
};

/**
 * Remote module
 */
export type ModuleRemoteConfig<Props extends Record<string, any> = {}> = {
  /**
   * Module name（Then name of submodule export to global）
   */
  name: string;
  /**
   * Entry script src
   */
  entry: string;
  /**
   * Style(s)（using ExtractTextPlugin to compile a css file）
   */
  styles?: string | string[];
  /**
   * Conditions for activating submodules
   * - string: prefix to match then location.pathname
   * - function: custom match function
   * - array: multiple match conditions
   * - default: will always load in app start
   */
  activeRule?: string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>;
  /**
   * Props，pass to submodule "mount" and "unmount" lifecycle
   */
  props?: Props;
};

/**
 * Functional module,
 * executes when after "beforeLoad" and before "beforeMount" lifecycle
 * return properties to register same as Mount
 */
export type FunctionalModule = (
  App: App | typeof Vue2,
) => void | RegisterProperties | Promise<void | RegisterProperties>;

/**
 * Router Guard
 */
export interface Router {
  beforeEach(guard: (to: any, from: any, next: () => void) => any): unknown;
  afterEach(guard: (to: any, from: any) => any): unknown;
}

/**
 * Registrable module
 */
export type RegistrableModule =
  | ModuleRemoteConfig
  | Record<string, string | Omit<ModuleRemoteConfig, 'name'>>
  | FunctionalModule;

/**
 * Formated config from user registers
 */
export type InnerRegistrableModule = (Omit<ModuleRemoteConfig, 'styles'> & { styles?: string[] }) | FunctionalModule;

/**
 * Inner register submodule
 * @internal
 */
export type InnerRegisterSubModule = {
  /**
   * 模块原始被格式化后的配置
   */
  config: InnerRegistrableModule;
  /**
   * 生命周期
   */
  lifecycles: {
    [key in keyof Lifecycles]?: Array<Lifecycle>;
  };
  /**
   * 激活条件
   */
  activeRule?: Extract<ModuleRemoteConfig['activeRule'], Function>[];
  /**
   * 是否已激活
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

/**
 * Lifecycle function
 */
export type Lifecycle = (module: InnerRegistrableModule) => void;

/**
 * Lifecycles
 */
export type Lifecycles = {
  /**
   * before bootstrap lifecycle
   */
  beforeLoad?: Lifecycle | Array<Lifecycle>;
  /**
   * before mount lifecycle
   */
  beforeMount?: Lifecycle | Array<Lifecycle>;
  /**
   * after mount lifecycle
   */
  afterMount?: Lifecycle | Array<Lifecycle>;
  /**
   * before unmount lifecycle
   */
  beforeUnmount?: Lifecycle | Array<Lifecycle>;
  /**
   * after unmount lifecycle
   */
  afterUnmount?: Lifecycle | Array<Lifecycle>;
};

/**
 * Error handler
 */
export type ErrorHandler = (error: Error, module: InnerRegistrableModule) => void;

/**
 * Resolver
 */
export interface Resolver<Context = any> {
  /**
   * execution context
   */
  context: Context;
  /**
   * execute script
   * @param entry remote script src
   */
  execScript<R = unknown>(entry: string): R | Promise<R>;
  /**
   * add styles
   * @param styles style href
   */
  addStyles(styles: string[]): void | Promise<void>;
  /**
   * remove styles
   * @param styles style href
   */
  removeStyles(styles: string[]): void | Promise<void>;
}

/**
 * create resolver options
 */
export interface ResolverCreatorOptions<Context = any> {
  /**
   * container container to append script, default is append to body in client side
   */
  container?: string | ((proxy: Context) => Element);
  /**
   * global variables to extend to resolver context
   */
  globalVariables?: Record<string, any>;
}
