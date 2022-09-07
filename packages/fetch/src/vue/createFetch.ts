import { isVue2, markRaw } from 'vue-demi';
import { fetchSymbol, setActiveFetch, Fetch, RegistApiPlugin } from './rootFetch';
import { FetchClient, RegistApi } from '../types';

export function createFetch(client: FetchClient): Fetch {
  const _p: Fetch['_p'] = [];
  // plugins added before calling app.use(pinia)
  let toBeInstalled: RegistApiPlugin[] = [];

  const fetch: Fetch = markRaw({
    install(app) {
      // this allows calling useFetch() outside of a component setup after
      setActiveFetch(fetch);

      if (!isVue2) {
        fetch._a = app;
        app.provide(fetchSymbol, fetch);
        app.config.globalProperties.$fetch = fetch;

        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    // store regist apis
    _r: new Map<string, RegistApi<any>>(),
    // regist api plugins
    _p,
    client,
  });

  return fetch;
}
