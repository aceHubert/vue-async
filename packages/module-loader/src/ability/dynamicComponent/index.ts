/**
 * dynamicComponent
 */
import { error } from '@vue-async/utils';

// Types
import { VueConstructor } from 'vue';
import { Store } from 'vuex';
import { ModuleContext } from 'types/module';

export { default as storeModule } from './storeModule';

export const namespaces = 'dynamicComponent';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (Vue: VueConstructor, store: Store<any>): ModuleContext['$dynamicComponent'] {
  return {
    namespaces,
    /**
     * add component to store
     * @param component vue component
     * @param position position
     */
    add(component, position) {
      if (!(typeof component === 'object' || typeof component === 'function')) {
        return error(
          process.env.NODE_ENV === 'production',
          '[moduleLoader] dynamicComponent function "add" only accept object or function component as param.',
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
        return error(
          process.env.NODE_ENV === 'production',
          '[moduleLoader] dynamicComponent function "remove" only accept string name of component as param.',
        );
      }
      store.commit(`${namespaces}/remove`, {
        name,
        position,
      });
    },
  };
}
