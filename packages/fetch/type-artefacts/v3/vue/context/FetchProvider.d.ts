import { PropType } from 'vue-demi';
import { Client, RegistApi } from '../../types';
export interface FetchProviderProps {
  client: Client;
  api?: RegistApi<any>;
  prefix?: string;
}
export declare const FetchProvider: import('vue-demi').DefineComponent<
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
  () => import('vue-demi').VNode<
    import('vue-demi').RendererNode,
    import('vue-demi').RendererElement,
    {
      [key: string]: any;
    }
  >,
  unknown,
  {},
  {},
  import('vue-demi').ComponentOptionsMixin,
  import('vue-demi').ComponentOptionsMixin,
  Record<string, any>,
  string,
  import('vue-demi').VNodeProps & import('vue-demi').AllowedComponentProps & import('vue-demi').ComponentCustomProps,
  Readonly<
    import('vue-demi').ExtractPropTypes<{
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
  >,
  {}
>;
