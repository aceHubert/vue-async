import type { FunctionalModule } from '../types';
import type { Bootstrap, Mount, Unmount } from './types';

/**
 * typed functional module defintion
 * @example export default defineFunctionalModule({})
 */
export function defineFunctionalModule(module: FunctionalModule) {
  return module;
}
/**
 * typed bootstrap defintion
 * @example export const bootstrap = defineBootstrap((App) => {})
 */
export function defineBootstrap(bootstrap: Bootstrap) {
  return bootstrap;
}

/**
 * typed mount defintion
 * @example export const mount = defineMount((App, props) => {})
 */
export function defineMount(mount: Mount) {
  return mount;
}

/**
 * typed unmount defintion
 * @example export const unmount = defineUnmount((App, props) => {})
 */
export function defineUnmount(unmount: Unmount) {
  return unmount;
}
