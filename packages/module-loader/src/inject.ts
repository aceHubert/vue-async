import { hasOwn } from '@vue-async/utils';
import { Inject } from './core/Inject';

// Types
import { InjectResult } from './types';

/**
 * create a new Inject instance
 * @param store Store
 */
export function createInject(store: Record<string, InstanceType<typeof Inject>>) {
  function inject(tag: string): InjectResult;
  function inject(tag: string, functionToAdd: Function, priority?: number, acceptedArgs?: number): void;
  function inject(
    tag: string,
    functionToAdd?: Function,
    priority?: number,
    acceptedArgs?: number,
  ): InjectResult | void {
    if (functionToAdd) {
      if (!hasOwn(store, tag)) {
        store[tag] = new Inject();
      }

      store[tag].addFilter(functionToAdd, priority, acceptedArgs);
    } else {
      return {
        has(functionToCheck: Function | boolean) {
          if (!hasOwn(store, tag)) {
            return false;
          }

          return store[tag].hasFilter(functionToCheck);
        },
        remove(functionToRemove: Function, priority = 10) {
          let removed = false;
          if (hasOwn(store, tag)) {
            removed = store[tag].removeFilter(functionToRemove, priority);
          }
          return removed;
        },
        removeAll(priority: boolean | number) {
          if (hasOwn(store, tag)) {
            store[tag].removeAllFilters(priority);
          }
        },
        filter<T = unknown, R = T>(value: T, ...args: unknown[]) {
          if (hasOwn(store, 'all')) {
            // todo:apply tag "all" filter
          }

          if (hasOwn(store, tag)) {
            return store[tag].applyFilters<T, R>(value, ...args);
          }

          return Promise.resolve(value as unknown as R);
        },
        exec(...args: unknown[]) {
          if (hasOwn(store, tag)) {
            return store[tag].doAction(...args);
          }
          return Promise.resolve();
        },
      } as InjectResult;
    }
  }

  return inject;
}

/**
 * Global filters is used as singleton and can storage all inject callbacks;
 */
export const globalStorage = Inject.buildPreinitializedStorage({});

/**
 * Global Inject instalce
 */
export const globalInject = createInject(globalStorage);
