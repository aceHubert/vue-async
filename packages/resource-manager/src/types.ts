import { defineComponent, App, Component as VueComponent, ComponentPublicInstance } from 'vue-demi';

class Helper<Props> {
  Return = defineComponent({} as { props: Record<keyof Props, any> });
}

export type DefineComponent<Props> = Helper<Props>['Return'];

export type SuspenseComponent = VueComponent & { __esModule?: any; default?: VueComponent };

export interface AsyncFactory<I = any, R = any> {
  (input?: I): Promise<R>;
  suspenseInstance?: ComponentPublicInstance;
  resolved?: VueComponent | boolean;
  $$waiter?: Promise<R>;
  res?: any;
}

// CreateResource
export interface ResourceResult<I = any, R = any, E = Error> {
  read(input?: I): Promise<R>;
  $result: R;
  $error: E;
  $loading: boolean;
  $loaded: boolean;
  fork(): ResourceResult<I, R, E>;
}

export interface ResourceOptions<I, R, E> {
  prevent?: boolean;
  onSuccess(result: R): R; // works on the datas need to concat
  onError(err: E): E;
}

export interface ResourceManager {
  /**
   * Install resource manager plugin
   */
  install: (app: App) => void;
}
