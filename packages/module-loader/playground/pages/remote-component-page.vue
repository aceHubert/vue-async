<template>
  <div>
    <h3>这是使用 componentLoader 加载。</h3>
    <AsyncComponent />
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, defineAsyncComponent } from 'vue-demi';

const AsyncComponent = defineAsyncComponent(() => {
  const instance = getCurrentInstance();

  return instance!.proxy!.$componentLoader(
    'componentA',
    'http://localhost:7010/componentA/index.umd.js',
    'http://localhost:7010/componentA/style.css',
  );
});
</script>

<style lang="less" scoped>
h3 {
  color: blue;
}
</style>
