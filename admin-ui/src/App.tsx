import { Route } from 'vue-router';
import { Component as VueComponent, AsyncComponent } from 'vue';
import { Vue, Component, Watch } from 'vue-property-decorator';
import { sanitizeComponent, hasOwn } from '@vue-async/utils';
import { languagePattern } from '@/router/utils';
import { AppStore } from '@/store/modules';
import { DarkThemeStorageKey, TabsStorageKey } from '@/data/storage/keys';

// layouts
const defaultLayouts: { [name: string]: VueComponent | AsyncComponent } = {
  default: () => import(/* webpackChunkName: "layouts" */ '@/layouts/default'),
};

@Component({
  name: 'app',
  metaInfo: {
    title: '',
    titleTemplate: (title: string) => (title ? `${title} | Admin-UI` : 'Admin-UI'),
  },
})
export default class Index extends Vue {
  get layout(): VueComponent | AsyncComponent {
    // 优先使用路由配置中的 layout
    let layoutName: string = this.$route.meta.layout;
    if (!layoutName && this.$route.matched.length) {
      layoutName = sanitizeComponent(this.$route.matched.slice(-1)[0].components.default).options.layout;
    }

    const layouts = Object.assign({}, this.$moduleLoadManager.layouts, defaultLayouts);

    if (layoutName && hasOwn(layouts, layoutName)) {
      return layouts[layoutName];
    } else {
      return layouts.default;
    }
  }

  tabs: Array<Tab> = [
    {
      title: 'tab.dashboard',
      to: { name: 'dashboard' },
      exact: true,
      closeable: false,
    },
    ...(localStorage ? JSON.parse(localStorage.getItem(TabsStorageKey) || '[]') : []),
  ];

  // 正序排列
  get menus(): Array<Menu> {
    let index = 9999;
    return [
      {
        title: 'menu.dashboard',
        icon: 'mdi-view-dashboard',
        to: { name: 'dashboard' },
        index: -9999,
      },
      ...AppStore.menus,
    ]
      .map(menu => Object.assign({}, menu, { index: typeof menu.index === 'number' ? menu.index : ++index }))
      .sort((a, b) => a.index - b.index);
  }

  @Watch('$route')
  watchRoute(val: Route) {
    // 排除语言前缀、结尾斜杠
    // 不同参数打开新 Tab
    const languageRegexp = new RegExp('^/(' + languagePattern + ')');
    const fullPathWithoutLocale = val.fullPath.replace(languageRegexp, '').replace(/\/$/, '');
    // 404 不加入 tab
    if (
      val.name !== 'not-found' &&
      this.tabs.findIndex(
        (tab: Tab) =>
          this.$router
            .resolve(tab.to)
            .route.fullPath.replace(languageRegexp, '')
            .replace(/\/$/, '') === fullPathWithoutLocale,
      ) < 0
    ) {
      this.tabs.push({
        title: val.meta.title || val.name,
        name: val.name || '',
        to: { name: val.name!, query: val.query },
        closeable: val.meta.closeable === undefined ? true : !!val.meta.closeable,
        exact: val.meta.exact === undefined ? true : !!val.meta.exact,
      });
    }
  }

  @Watch('tabs', { deep: true })
  watchTabs(val: Array<any>) {
    // 排除第一个 Dashboard
    localStorage && localStorage.setItem(TabsStorageKey, JSON.stringify(val.slice(1)));
  }

  // set theme
  handldSetDarkTheme(dark: boolean) {
    this.$vuetify.theme.dark = dark;
    localStorage && localStorage.setItem(DarkThemeStorageKey, String(dark));
  }

  render(h: any) {
    // @ts-ignore
    const { layout, tabs, menus } = this;
    return (
      <layout
        tabs={tabs}
        menus={menus}
        dark={this.$vuetify.theme.dark}
        {...{ on: { 'update:dark': this.handldSetDarkTheme } }}
      ></layout>
    );
  }
}
