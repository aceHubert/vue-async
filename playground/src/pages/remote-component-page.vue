<template>
  <div>
    <h3>这是使用 registerComponents 在页面动态加载远程组件。</h3>
    <AsyncComponent />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue-demi';
import { registerComponents } from '@vue-async/module-loader';

const useRemoteComponents = registerComponents({
  componentA: {
    src: 'http://localhost:7010/componentA/index.umd.js',
    styles: 'http://localhost:7010/componentA/style.css',
  },
});

const AsyncComponent = defineAsyncComponent(() => {
  const remoteComponents = useRemoteComponents();
  return remoteComponents.componentA();
});
</script>

<style lang="less" scoped>
h3 {
  color: blue;
}
</style>
