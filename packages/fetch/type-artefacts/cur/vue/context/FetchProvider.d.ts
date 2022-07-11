import { PropType } from 'vue-demi';
import { Client, RegistApi } from '../../types';
export interface FetchProviderProps {
  client: Client;
  api?: RegistApi<any>;
  prefix?: string;
}
export declare const FetchProvider: import('vue').ComponentOptions<
  import('vue').default,
  import('@vue/composition-api').ShallowUnwrapRef<() => import('vue').VNode> & import('@vue/composition-api').Data,
  {},
  {},
  {
    client: {
      type: PropType<Client>;
      required: true;
    };
    api: {
      type: PropType<RegistApi<any>>;
    };
    prefix: {
      type: PropType<string>;
    };
  },
  import('@vue/composition-api').ExtractPropTypes<{
    client: {
      type: PropType<Client>;
      required: true;
    };
    api: {
      type: PropType<RegistApi<any>>;
    };
    prefix: {
      type: PropType<string>;
    };
  }>
> &
  Omit<import('vue').VueConstructor<import('vue').default>, never> &
  (new (...args: any[]) => import('@vue/composition-api').ComponentRenderProxy<
    {
      client: Client;
    } & {
      api?: RegistApi<any> | undefined;
      prefix?: string | undefined;
    },
    import('@vue/composition-api').ShallowUnwrapRef<() => import('vue').VNode>,
    import('@vue/composition-api').Data,
    {},
    {},
    {},
    {},
    {},
    {
      client: Client;
    } & {
      api?: RegistApi<any> | undefined;
      prefix?: string | undefined;
    },
    {},
    true
  >);
