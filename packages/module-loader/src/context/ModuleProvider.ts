import { defineComponent, provide, toRef, h, PropType } from 'vue-demi';
import { globalInject } from '../inject';
import { ModuleInjectSymbol, InjectFn } from '../shared/context';
import { FragmentComponent as Fragment } from '../shared/fragment';

export interface ModuleProviderProps {
  inject: InjectFn;
}

export const ModuleProvider = defineComponent({
  name: 'ModuleProvider',
  props: {
    inject: { type: (null as unknown) as PropType<InjectFn>, default: globalInject },
  },
  setup(props: ModuleProviderProps, { slots }) {
    provide(ModuleInjectSymbol, toRef(props, 'inject'));

    return () => h(Fragment, {}, slots.default?.());
  },
});
