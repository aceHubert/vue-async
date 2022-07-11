import { defineComponent, provide, toRef, h, PropType } from 'vue-demi';
import { AjaxClientSymbol, AjaxRegistApiSymbol, AjaxUrlPrefixSymbol } from '../shared/context';
import { FragmentComponent as Fragment } from '../shared/fragment';
import { useClient } from '../hooks/useClient';

// Types
import { Client, RegistApi } from '../../types';

export interface FetchProviderProps {
  client: Client;
  api?: RegistApi<any>;
  prefix?: string;
}

export const FetchProvider = defineComponent({
  name: 'FetchProvider',
  props: {
    client: { type: (null as unknown) as PropType<Client>, required: true },
    api: { type: Object as PropType<RegistApi<any>> },
    prefix: { type: String as PropType<string> },
  },
  setup(props: FetchProviderProps, { slots }) {
    const client = useClient();

    provide(AjaxClientSymbol, toRef(props, 'client'));
    provide(AjaxRegistApiSymbol, toRef(props, 'api'));
    provide(AjaxUrlPrefixSymbol, toRef(props, 'prefix'));

    // @ts-ignore
    if (client.value) {
      throw new Error('There can only be one Ajax Client Context in the Vue Tree');
    }

    return () => h(Fragment, {}, slots.default?.());
  },
});
