import { MethodUrl, DefineRegistApiOptions, RegistApiDefinition } from '../types';
/**
 * Define regist apis
 * @param id
 * @param options
 */
export declare function defineRegistApi<C extends Record<string, MethodUrl>>(id: string, options: Omit<DefineRegistApiOptions<C>, 'id'>): RegistApiDefinition<C>;
/**
 * Define regist apis
 * @param options
 */
export declare function defineRegistApi<C extends Record<string, MethodUrl>>(options: DefineRegistApiOptions<C>): RegistApiDefinition<C>;
