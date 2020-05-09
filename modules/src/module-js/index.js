// 模块的路由配置数组
import routes from './router';
// store是以vuex module的形式进行导入使用
// import storeModule from './store'

// 样式
import './styles/index.less';

import PluginA from './components/pluginA';
import PluginB from './components/pluginB';
import PluginExtend from './components/extend';
import PluginTwitter from './components/twitter';

// 导出模块函数
// 参数Vue: vue构造对象
// 本函数中的this指向主程序 vue root实例的引用
export default function(Vue) {
  // 合并路由
  this.$moduleLoadManager.addRoutes(routes);

  // 添加导航
  // 此方法为主程序中的扩展
  this.$moduleLoadManager.addMenus([
    {
      title: 'js.remote',
      icon: 'mdi-menu',
      index: 0,
      children: [
        {
          title: 'PageA',
          to: { name: 'remote-page-a' },
          icon: 'mdi-alpha-a-circle-outline',
        },
        {
          title: 'PageB',
          to: '/remote-page-b',
          icon: 'mdi-alpha-b-circle-outline',
        },
      ],
    },
  ]);

  // 添加语言
  // 此方法为主程序中的扩展
  const loadedLangs = new Set();
  const languages = this.$moduleLoadManager.languages;
  // set fallback
  const fallbackLocale = this.$i18n.fallbackLocale;
  const { locale } = languages.find(l => l.alternate === fallbackLocale || l.locale === fallbackLocale);
  this.$moduleLoadManager
    .addLocaleMessage(fallbackLocale, { js: require(`./lang/${locale}`).default })
    .then(lang => loadedLangs.add(lang));
  // change locale
  this.$watch(
    () => this.$i18n.locale,
    lang => {
      const { locale } = languages.find(l => l.alternate === lang || l.locale === lang);
      !loadedLangs.has(lang) &&
        this.$moduleLoadManager
          .addLocaleMessage(lang, { js: require(`./lang/${locale}`).default })
          .then(lang => loadedLangs.add(lang));
    },
    { immediate: true },
  );

  // 注册组件
  // 主程序调用前需要检查是否已经被加载成功
  Vue.component('plugin-a', PluginA);

  // 动态添加组件
  // 组件为对象时 component 为必须的，其它参数与主程序协议一致
  this.$dynamicComponent.add(PluginA, 'dashboard');
  this.$dynamicComponent.add(
    { component: PluginB, cols: 2, icon: 'mdi-home', title: '自定义标题', type: 'card' },
    'dashboard',
  );
  this.$dynamicComponent.add(
    { component: PluginB, name: 'copy-plugin-b', icon: 'mdi-menu', type: 'card' },
    'dashboard',
  );
  this.$dynamicComponent.add({ component: PluginTwitter, cols: 4, type: 'none', index: 0 }, 'dashboard');
  this.$dynamicComponent.add(
    { component: PluginExtend, title: 'JS-Vue.extend', cols: 4, type: 'card', index: 1 },
    'dashboard',
  );

  // 合并状态
  // 使用模块名当做vuex store模块的命名空间
  // this.$store.registerModule(moduleInfo.name, storeModule)

  // 其他逻辑
}
