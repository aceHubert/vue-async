import { warn } from '@ace-util/core';
import { registerSubModules } from './register';

// Types
import type { Lifecycles, ModuleLoader } from './types';

const DEV_MODULE_KEY = 'dev-modules';
/**
 * Register dev modules from localStorage
 */
export function useDevModules(...args: [Lifecycles?, ModuleLoader?] | [ModuleLoader?]) {
  let loader: ModuleLoader | undefined, lifeCycles: Lifecycles | undefined;
  if (args[0] && (('setOptions' in args[0]) as any)) {
    loader = args[0] as ModuleLoader;
  } else {
    lifeCycles = args[0] as Lifecycles;
    loader = args[1];
  }
  const devModuleStr = localStorage.getItem(DEV_MODULE_KEY);
  let devModules = [];
  if (devModuleStr) {
    try {
      devModules = JSON.parse(devModuleStr);
    } catch {
      warn(process.env.NODE_ENV === 'production', `{DEV_MODULE_KEY} is not a valid JSON string`);
    }
  }
  return registerSubModules(devModules, lifeCycles)(loader);
}
