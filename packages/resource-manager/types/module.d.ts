import { Component as VueComponent, PluginFunction } from 'vue';
import { PropsDefinition, DefaultProps } from 'vue/types/options';

export type UseOptions = {
  mode?: 'visible' | 'hidden';
};

export declare const ResourceManager: ResourceManager;

export interface ResourceManager {
  install: PluginFunction<UseOptions>;
  version: string;
}

export type SuspenseComponent = VueComponent & { __esModule?: any; default?: VueComponent };

export interface AsyncFactory<I = any, R = any> {
  (input?: I): Promise<R>;
  suspenseInstance?: Vue;
  resolved?: VueComponent | boolean;
  $$waiter?: Promise<R>;
  res?: any;
}

// Suspense Component
export const Suspense: SuspenseComponent;

// Lazy
export interface Lazy<PropsDef = PropsDefinition<DefaultProps>> {
  (asyncFactory: AsyncFactory, props?: PropsDef): VueComponent;
}

// CreateResource
export interface ResourceResult<I, R, E> {
  read(input: I): Promise<R>;
  $result: R;
  $error: E;
  $loading: boolean;
  $loaded: boolean;
  fork(): ResourceResult<I, R, E>;
}

export interface ResourceOptions<I, R, E> {
  prevent?: boolean;
  onSuccess(result: R, args: I): R; // works on the datas need to concat
  onError(err: E): E;
}

export interface CreateResource<I = any, R = any, E = any> {
  (fetchFactory: AsyncFactory<I, R>, options?: ResourceOptions<I, R, E>): ResourceResult<I, R, E>;
}
