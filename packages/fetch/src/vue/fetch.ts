import { getCurrentInstance, inject } from 'vue-demi';
import { debug } from '../env';
import { registApi } from '../core';
import { fetchSymbol, setActiveFetch, activeFetch } from './rootFetch';
import {
  MethodUrl,
  DefineRegistApiOptions,
  DefineRegistApiOptionsInPlugin,
  RegistApiDefinition,
  RegistApi,
  Fetch,
} from '../types';

/**
 * Define regist apis
 * @param id
 * @param options
 */
export function defineRegistApi<C extends Record<string, MethodUrl>>(
  id: string,
  options: Omit<DefineRegistApiOptions<C>, 'id'>,
): RegistApiDefinition<C>;
/**
 * Define regist apis
 * @param options
 */
export function defineRegistApi<C extends Record<string, MethodUrl>>(
  options: DefineRegistApiOptions<C>,
): RegistApiDefinition<C>;
export function defineRegistApi<C extends Record<string, MethodUrl>>(
  idOrOptions: string | DefineRegistApiOptions<C>,
  registOptions?: Omit<DefineRegistApiOptions<C>, 'id'>,
): RegistApiDefinition<C> {
  let id: string;
  let options: Omit<DefineRegistApiOptions<C>, 'id'>;

  if (typeof idOrOptions === 'string') {
    id = idOrOptions;
    options = registOptions!;
  } else {
    const { id: _id, ...restOptions } = idOrOptions;
    id = _id;
    options = restOptions;
  }

  let optionsForPlugin: DefineRegistApiOptionsInPlugin<C> = { ...options };

  function useRegistApi(fetch?: Fetch) {
    const currentInstance = getCurrentInstance();

    fetch = fetch || (currentInstance && inject(fetchSymbol)) || undefined;
    if (fetch) setActiveFetch(fetch);

    if (debug && !activeFetch) {
      throw new Error(
        `getActiveFetch was called with no active Fetch. Did you forget to install fetch?\n` +
          `\tconst fetch = createFetch()\n` +
          `\tapp.use(fetch)\n` +
          `This will fail in production.`,
      );
    }

    fetch = activeFetch!;

    if (!fetch._r.has(id)) {
      // creating regist apis register it to 'fetch._r'
      const registApis = registApi(fetch.client, options.apis, options.prefix, id);

      // apply all local plugins
      options.plugins?.forEach((extender) => {
        Object.assign(
          registApis,
          extender({
            id,
            registApis,
            fetch: fetch!,
            app: fetch!._a,
            options: optionsForPlugin,
          }),
        );
      });

      // apply all global plugins
      fetch._p.forEach((extender) => {
        Object.assign(
          registApis,
          extender({
            id,
            registApis,
            fetch: fetch!,
            app: fetch!._a,
            options: optionsForPlugin,
          }),
        );
      });

      fetch._r.set(id, registApis);
    }

    // get from store
    const apis: RegistApi<C> = fetch._r.get(id)!;

    return apis;
  }
  return useRegistApi;
}
