import './vue';
import { HookFunction } from './hook';
import { ModuleLoader } from './module';

export default ModuleLoader;

export const hook: HookFunction;
export { Framework, ModuleRemoteConfig, ModuleConfig, ModuleLoaderOptions, ModuleContext } from './module';
export { Bootstrap } from './sub';
