// 模块的路由配置数组
import routes from './router';
// store是以vuex module的形式进行导入使用
import storeModule, { namespace } from './store';

// component(sync)
import componentA from './components/componentA';
import componentB from './components/componentB';
import componentExtend from './components/extend';
import componentTwitter from './components/twitter';

// styles
import './styles/index.less';

// 导出模块函数
// 参数Vue: vue构造对象
// 本函数中的this指向主程序 vue root实例的引用
export default function (Vue) {
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
  const { locale } = languages.find((l) => l.alternate === fallbackLocale || l.locale === fallbackLocale);
  this.$moduleLoadManager
    .addLocaleMessage(fallbackLocale, { js: require(`./lang/${locale}`).default })
    .then((lang) => loadedLangs.add(lang));
  // change locale
  this.$watch(
    () => this.$i18n.locale,
    (lang) => {
      const { locale } = languages.find((l) => l.alternate === lang || l.locale === lang);
      !loadedLangs.has(lang) &&
        this.$moduleLoadManager
          .addLocaleMessage(lang, { js: require(`./lang/${locale}`).default })
          .then((lang) => loadedLangs.add(lang));
    },
    { immediate: true },
  );

  // 注册组件
  // 主程序调用前需要检查是否已经被加载成功
  Vue.component('component-a', componentA);

  // 注册vuex module
  this.$store.registerModule(namespace, storeModule);

  // 其他逻辑
}
