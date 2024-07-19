import { App, Component as VueComponent, ComponentPublicInstance } from 'vue-demi';

export interface ResourceManager {
  /**
   * App linked to this ModuleLoader instance
   * @internal
   */
  _a: App;
  /**
   * Install resource manager plugin
   */
  install: (app: App) => void;
}

/**
 * Suspense options
 */
export type SuspenseOptions = {
  /**
   * Display components when all async factories are resolved
   * @default 'visible'
   */
  mode?: 'visible' | 'hidden';
  /**
   * The tag name of the hidden wrapper when `mode` is `hidden`
   * @default 'div'
   */
  hiddleWrapperTag?: string;
};

/**
 * Create resource options
 */
export interface ResourceOptions<R, E> {
  /**
   * Prevent multiple requests,
   * it will return the last request promise when the previous request is not completed yet if set to "true".
   * @default false
   */
  prevent?: boolean;
  /**
   * Suspensible when using Suspense component
   * @default true
   */
  suspensible?: boolean;
  /**
   * works on the datas need to concat
   * @param result Result data
   */
  onSuccess?: (result: R) => R;
  /**
   * works on some error logger
   * @param err Error
   */
  onError?: (err: E) => E;
}

/**
 * Create resource factory
 */
export interface AsyncFactory<I extends any[], R> {
  (...input: I): Promise<R>;
  suspenseInstance?: ComponentPublicInstance;
  resolved?: VueComponent | boolean;
  $$waiter?: Promise<R>;
  res?: any;
}

/**
 * Create resource result
 */
export interface ResourceResult<I extends any[], R, E> {
  read(...input: I): Promise<R>;
  $result: R;
  $error: E;
  $loading: boolean;
  $loaded: boolean;
  fork(): ResourceResult<I, R, E>;
}
