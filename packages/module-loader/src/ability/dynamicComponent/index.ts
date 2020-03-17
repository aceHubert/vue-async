import { Component as VueComponent } from 'vue';
import { Store } from 'vuex';
import { isProduction, error } from '../../tool';

export default function(store: Store<any>) {
  return {
    /**
     * add component to store
     * @param component vue component
     * @param position position
     */
    create(component: VueComponent, position: string) {
      if (typeof component !== 'object') {
        return error(
          !isProduction,
          'dynamicComponent function "create" only accept object component as param.',
        );
      }
      store.commit('dynamicComponent/create', {
        component,
        position,
      });
    },
    /**
     * remove component from store
     * @param name component name
     * @param position position
     */
    destroy(name: string, position: string) {
      if (typeof name !== 'string') {
        return error(
          !isProduction,
          'dynamicComponent function only accept string name of component as param.',
        );
      }
      store.commit('dynamicComponent/destroy', {
        name,
        position,
      });
    },
  };
}
