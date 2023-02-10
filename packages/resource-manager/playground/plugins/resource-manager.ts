import Vue from 'vue';
import ResourceManager from '@vue-async/resource-manager';

/**
 * mode： hidden | visible
 * hidden：子组件内容不显示，在所有 promise 加载完后才显示
 * visible：子组件内容显示，fallback 在最后一个 promise 结束后消失
 */
Vue.use(ResourceManager, { mode: 'hidden' });
