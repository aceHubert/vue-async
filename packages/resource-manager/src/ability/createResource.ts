import Vue from 'vue';
import { error } from '@vue-async/utils';
import { del, add } from './Suspense';
import { currentInstance, currentSuspenseInstance, setCurrentInstance } from './currentInstance';
import findSuspenseInstance from './findSuspenseInstance';

// Types
import { AsyncFactory, ResourceOptions, ResourceResult } from 'types/resource-mananger';

Vue.mixin({
  created(this: Vue) {
    setCurrentInstance(this);
  },
});

//Vue.observable works in 2.6+
function observable(data: any) {
  if (Vue.observable) {
    return Vue.observable(data);
  }
  return new Vue({
    data() {
      return data;
    },
  }).$data;
}

interface Result<R, E> {
  $$promiser: Promise<R>;
  $$result: R;
  $$error: E;
  $$loading: boolean;
  $$loaded: boolean;
}

export default function CreateResource<I = any, R = any, E = Error>(
  fetchFactory: AsyncFactory<I, R>,
  options?: ResourceOptions<I, R, E>,
): ResourceResult<I, R, E> {
  const $res: Result<R, E> = observable({
    $$result: null,
    $$error: null,
    $$loading: false,
    $$loaded: false, // it has loaded data successed once more
  });

  const currInstance = currentInstance as Vue;
  fetchFactory.suspenseInstance = currentSuspenseInstance
    ? currentSuspenseInstance
    : findSuspenseInstance(currInstance);

  const hasSuspenseInstance = !!fetchFactory.suspenseInstance;

  const resourceResult: ResourceResult<I, R, E> = {
    read(input?: I) {
      // prevent
      if (options && options.prevent && $res.$$loading) {
        return $res.$$promiser;
      }

      $res.$$loading = true;
      // Because we don't need caching, this is just a unique identifier,
      // and each call to .read() is a completely new request.
      const uniqueWrapFactory = (i?: I) => fetchFactory(i);

      if (hasSuspenseInstance) {
        // Establish a relationship between the fetchFactory and the current component instance
        uniqueWrapFactory.suspenseInstance = fetchFactory.suspenseInstance;
        add(uniqueWrapFactory);
      }

      // Start fetching asynchronous data
      const promise = ($res.$$promiser = uniqueWrapFactory(input));

      promise
        .then((res) => {
          // Trigger update
          $res.$$result = options && options.onSuccess ? options.onSuccess(res) : res;
          if (!$res.$$loaded) {
            $res.$$loaded = true;
          }
          if (hasSuspenseInstance) {
            del(uniqueWrapFactory);
          }
        })
        .catch((err: E) => {
          error(process.env.NODE_ENV === 'production', (err as any).message);

          $res.$$error = options && options.onError ? options.onError(err) : err;

          if (hasSuspenseInstance) {
            del(uniqueWrapFactory, err);
          }
        })
        .finally(() => {
          $res.$$loading = false;
        });

      return promise;
    },
    get $result(): R {
      return $res.$$result;
    },
    set $result(val: R) {
      $res.$$result = val;
    },
    get $error(): E {
      return $res.$$error;
    },
    set $error(val: E) {
      $res.$$error = val;
    },
    get $loading(): boolean {
      return $res.$$loading;
    },
    get $loaded(): boolean {
      return $res.$$loaded;
    },
    fork() {
      return CreateResource((i?: I) => fetchFactory(i), options);
    },
  };

  return resourceResult;
}
