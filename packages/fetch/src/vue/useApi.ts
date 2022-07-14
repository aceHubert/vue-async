import { getActiveFetch } from './rootFetch';

// Types
import { MethodUrl } from '../types';

export function useFetch<C extends Record<string, MethodUrl>>() {
  return getActiveFetch<C>();
}
