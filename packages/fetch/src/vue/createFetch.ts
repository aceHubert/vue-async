import { isVue2, markRaw } from 'vue-demi';
import { registApi } from '../core/registApi';
import { Fetch, FetchOptions, fetchSymbol, setActiveFetch } from './rootFetch';

// Types
import { FetchClient, MethodUrl } from '../types';

export function createFetch<C extends Record<string, MethodUrl>>(client: FetchClient, options: FetchOptions): Fetch<C> {
  const registApis = registApi(client, options.apis, options.prefix);
  const fetch: Fetch = markRaw({
    install(app) {
      // this allows calling useFetch() outside of a component setup after
      // installing fetch's plugin
      setActiveFetch(fetch);
      if (!isVue2) {
        fetch._a = app;
        app.provide(fetchSymbol, fetch);
        app.config.globalProperties.$fetch = fetch;
      }
    },
    client,
    registApis,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _o: options,
  });

  return fetch;
}
