import { Fetch } from './rootFetch';
declare module 'vue/types/vue' {
    interface Vue {
        /**
         * Currently installed fetch instance.
         */
        $fetch: Fetch;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V> {
        /**
         * Fetch instance to install in your application. Should be passed to the
         * root Vue.
         */
        fetch?: Fetch;
    }
}
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        /**
         * Access to the application's Fetch
         */
        $fetch: Fetch;
    }
}
