import componentA from './components/componentA';
import componentB from './components/componentB';
// styles
import './index.less';

// 导出模块函数
// 参数Vue: vue构造对象
// 本函数中的this指向主程序 vue root实例的引用
export default function (Vue) {
  console.log(2, 'dymanicComponent');

  // 动态添加组件
  // 组件为对象时 component 为必须的，其它参数与主程序协议一致
  this.$dynamicComponent.add({ component: componentA, name: 'dymanic-component-a' }, 'dashboard');
  this.$dynamicComponent.add(
    {
      component: componentB,
      name: 'dymanic-component-b',
      cols: 2,
      icon: 'mdi-home',
      title: '自定义标题(extract css)',
      type: 'card',
    },
    'dashboard',
  );
  // 其他逻辑
}
