import { PluginFunction } from 'vue';
import { UseOptions } from '../src/install';
import { Suspense, lazy, createReaourse } from './src';

interface ResourceManager {
  install: PluginFunction<UseOptions>;
  version: string;
}

export default ResourceManager;
export { Suspense, lazy, createReaourse };
