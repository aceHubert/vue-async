import { getCurrentInstance, defineAsyncComponent } from '@vue/composition-api';

// @ts-ignore
export const AsyncComponent = defineAsyncComponent(() => {
  const instance = getCurrentInstance();
  return instance!.proxy.$componentLoader(
    'componentA',
    'http://localhost:7010/componentA/componentA.umd.js',
    'http://localhost:7010/componentA/componentA.css',
  );
});
