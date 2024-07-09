import { defineBootstrap, defineMount } from '@vue-async/module-loader/esm/sub';
// 模块的路由配置数组
import routes from './router';
import './assets/index.css';

export const bootstrap = defineBootstrap(async () => {
  console.log('dymanicRouter bootstrap');

  console.log('delay 3s');
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
});

// 导出模块函数
// 参数Vue: vue构造对象
// 本函数中的this指向主程序 vue root实例的引用
export const mount = defineMount((app, props) => {
  console.log('dymanicRouter', props);

  return {
    routes,
  };
});
