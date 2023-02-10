import { createInject, globalInject } from './inject';

// inject 重命名(与 vue hook 意义冲突)， 兼容历史版本。
const hook = globalInject;

export * from './shared';
export * from './hooks';
export * from './createLoader';
export * from './vue2-plugin';
export * from './version';
export * from './types';
export * from './globalExtensions';
export { setDebug } from './env';
export { registerSubModules, setModuleLoaderOptions, addErrorHandler, removeErrorHandler } from './register';
export { createInject, globalInject, hook };
