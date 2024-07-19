import warning from 'warning';
import { reactive, getCurrentInstance } from 'vue-demi';
import { del, add } from './Suspense';
import { findSuspenseInstance } from '../shared/suspenseInstance';

// Types
import type { AsyncFactory, ResourceOptions, ResourceResult } from '../types';

interface Result<R, E> {
  $$promiser?: Promise<R>;
  $$result: R;
  $$error: E;
  $$loading: boolean;
  $$loaded: boolean;
}

export function createResource<I extends any[] = any[], R = any, E = unknown>(
  fetchFactory: AsyncFactory<I, R>,
  options?: ResourceOptions<R, E>,
): ResourceResult<I, R, E> {
  const $res = reactive<Result<any, any>>({
    $$result: void 0,
    $$error: void 0,
    $$loading: false,
    $$loaded: false, // it has loaded data successed once more
  });

  let hasSuspenseInstance = false;

  // 在组件内部创建, 查找Suspense实例
  const currInstance = getCurrentInstance();
  if (options?.suspensible !== false && currInstance?.proxy) {
    fetchFactory.suspenseInstance = findSuspenseInstance(currInstance.proxy);
    hasSuspenseInstance = !!fetchFactory.suspenseInstance;
  }

  const resourceResult = {
    read(...input: I): Promise<R> {
      // prevent
      if (options && options.prevent && $res.$$loading) {
        return $res.$$promiser!;
      }

      $res.$$loading = true;
      // Because we don't need caching, this is just a unique identifier,
      // and each call to .read() is a completely new request.
      const uniqueWrapFactory: AsyncFactory<I, R> = (...i) => fetchFactory(...i);

      if (hasSuspenseInstance) {
        // Establish a relationship between the fetchFactory and the current component instance
        uniqueWrapFactory.suspenseInstance = fetchFactory.suspenseInstance;
        add(uniqueWrapFactory);
      }

      // Start fetching asynchronous data
      const promise = ($res.$$promiser = uniqueWrapFactory(...input));

      promise
        .then((res) => {
          // Trigger update
          $res.$$result = options?.onSuccess ? options.onSuccess(res) : res;
          if (!$res.$$loaded) {
            $res.$$loaded = true;
          }
          if (hasSuspenseInstance) {
            del(uniqueWrapFactory);
          }
        })
        .catch((err) => {
          warning(process.env.NODE_ENV === 'production', err.message);

          $res.$$error = options?.onError ? options.onError(err) : err;

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
      return createResource((...i: I) => fetchFactory(...i), options);
    },
  };

  return resourceResult;
}
