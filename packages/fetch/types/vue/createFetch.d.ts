import { Fetch, FetchOptions } from './rootFetch';
import { FetchClient, MethodUrl } from '../types';
export declare function createFetch<C extends Record<string, MethodUrl>>(client: FetchClient, options: FetchOptions): Fetch<C>;
