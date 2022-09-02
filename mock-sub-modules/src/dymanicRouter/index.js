// 模块的路由配置数组
import routes from './router';
import './assets/index.css';

// 导出模块函数
// 参数Vue: vue构造对象
// 本函数中的this指向主程序 vue root实例的引用
export async function bootstrap(Vue, props = {}) {
  console.log('dymanicRouter', props);

  console.log('delay 3s');
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });

  // 添加导航
  // 此方法为主程序中的扩展
  // opts.addMenus &&
  //   opts.addMenus([
  //     {
  //       title: 'dymanic router',
  //       icon: 'mdi-menu',
  //       index: 0,
  //       children: [
  //         {
  //           title: 'PageA',
  //           to: { name: 'dymanic-page-a' },
  //           icon: 'mdi-alpha-a-circle-outline',
  //         },
  //         {
  //           title: 'PageB',
  //           to: '/dymanic-page-b',
  //           icon: 'mdi-alpha-b-circle-outline',
  //         },
  //       ],
  //     },
  //   ]);
}

export function mount(Vue) {
  return routes;
}
