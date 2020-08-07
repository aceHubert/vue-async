/**
 * dynamicComponent
 */
import _Vue from 'vue';
import { Store } from 'vuex';
import { error } from '@vue-async/utils';
import { DynamicComponent } from '../../../types';

const isProduction = process.env.NODE_ENV === 'production';

export const namespaces = 'dynamicComponent';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (Vue: typeof _Vue, store: Store<any>) {
  return {
    /**
     * add component to store
     * @param component vue component
     * @param position position
     */
    add(component: DynamicComponent, position?: string) {
      if (!(typeof component === 'object' || typeof component === 'function')) {
        return error(
          isProduction,
          'dynamicComponent function "add" only accept object or function component as param.',
        );
      }
      store.commit(`${namespaces}/add`, {
        component,
        position,
      });
    },
    /**
     * remove component from store
     * @param name component name
     * @param position position
     */
    remove(name: string, position?: string) {
      if (typeof name !== 'string') {
        return error(isProduction, 'dynamicComponent function "remove" only accept string name of component as param.');
      }
      store.commit(`${namespaces}/remove`, {
        name,
        position,
      });
    },
  };
}
