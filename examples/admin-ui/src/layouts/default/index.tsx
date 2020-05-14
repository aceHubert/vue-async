import { Component as VeuCompoent, AsyncComponent } from 'vue';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import languages from '@/data/i18n/languages.json';
import classes from './styles/index.module.scss';
import ThemeComponent from '../components/theme';

@Component({
  name: 'layout-default',
})
export default class LayoutDefault extends Vue {
  // props
  @Prop({ type: Boolean, default: false }) dark!: boolean;
  @Prop({ type: Array, default: () => [] }) menus!: Array<Menu>;
  @Prop({ type: Array, default: () => [] }) tabs!: Array<Tab>;

  // data
  drawer = true;
  mini = false;
  acticeTab: string | null = null;
  userMenu = false;
  languageMenu = false;
  messages = '9+';
  currentDark = false;
  dialogShown = false;
  dialogComponent: VeuCompoent | AsyncComponent | null = null;

  // computed
  get currentLanguage() {
    return languages.find((l: LangConfig) => l.alternate === this.$i18n.locale || l.locale === this.$i18n.locale);
  }

  // watch
  @Watch('dark', { immediate: true })
  watchDark(val: boolean) {
    if (val !== this.currentDark) {
      this.currentDark = val;
    }
  }

  @Watch('currentDark')
  watchCurrentDark(val: boolean) {
    this.$emit('update:dark', val);
  }

  @Watch('dialogShown')
  watchDialogShown(val: boolean) {
    if (!val) {
      // 清除组件
      this.dialogComponent = null;
    }
  }

  // methods
  getNestedMenus(h: any, menus: Array<Menu> = [], subGroup = false) {
    return menus.map((menu: Menu) =>
      menu.children && menu.children.length ? (
        <v-list-group prepend-icon={!subGroup ? menu.icon : null} sub-group={subGroup}>
          <v-list-item-title slot="activator">{this.$tv(String(menu.title))}</v-list-item-title>
          {this.getNestedMenus(h, menu.children, true)}
        </v-list-group>
      ) : (
        <v-list-item link to={menu.to} exact>
          <v-list-item-action>
            <v-icon>{menu.icon}</v-icon>
          </v-list-item-action>

          <v-list-item-title>{this.$tv(String(menu.title))}</v-list-item-title>
        </v-list-item>
      ),
    );
  }

  // methods -> handle events
  handleRemoveTab(e: Event, index: number) {
    e.preventDefault();
    e.stopPropagation();
    this.tabs.splice(index, 1);
    this.$nextTick(() => {
      if (this.acticeTab && this.acticeTab !== this.$route.name && this.acticeTab !== this.$route.fullPath) {
        this.$router.replace(this.acticeTab);
      }
    });
  }

  // Customize
  handleSetTheme() {
    this.userMenu = false;
    // desktop
    if (this.$vuetify.breakpoint.mdAndUp) {
      // do something
    } else {
      // do something
    }
    this.dialogComponent = ThemeComponent;
    this.dialogShown = true;
  }

  // lifeCycle
  render(h: any) {
    const { dialogComponent } = this;

    return (
      <v-app id="layout-default">
        <v-navigation-drawer
          vModel={this.drawer}
          color="secondary"
          mini-variant={this.mini}
          mobile-break-point={960}
          app
          dark
          {...{
            on: {
              'update:mini-variant': (val: boolean) => {
                this.mini = val;
              },
            },
          }}
        >
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-avatar color="primary" size="36">
                <strong class="white--text body-1">A</strong>
              </v-avatar>
            </v-list-item-avatar>

            <v-list-item-title>Admin UI</v-list-item-title>

            <v-btn
              icon
              class="hidden-sm-and-down"
              onClick={(e: Event) => {
                e.stopPropagation();
                this.mini = !this.mini;
              }}
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense>{this.getNestedMenus(h, this.menus)}</v-list>

          <div slot="append">
            <v-divider></v-divider>

            <v-list-item class={['px-2', 'd-flex', { 'flex-row-reverse': !this.mini }]}>
              {/** Setting */}
              <v-menu
                vModel={this.userMenu}
                top
                offset-y
                close-on-content-click={false}
                max-width="280"
                origin="left bottom"
                transition="scale-transition"
                scopedSlots={{
                  activator: ({ on: menuOn }: any) => (
                    <v-tooltip
                      top
                      scopedSlots={{
                        activator: ({ on: tooltioOn }: any) => (
                          <v-btn icon class={{ 'ml-2': !this.mini }} {...{ on: { ...menuOn, ...tooltioOn } }}>
                            <v-icon>mdi-settings-outline</v-icon>
                          </v-btn>
                        ),
                      }}
                    >
                      <span>{this.$t('common.setting')}</span>
                    </v-tooltip>
                  ),
                }}
              >
                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar>
                        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title>John Leider</v-list-item-title>
                        <v-list-item-subtitle>Founder of Vuetify.js</v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-action>
                        <v-btn icon>
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item onClick={this.handleSetTheme}>
                      <v-list-item-icon>
                        <v-icon color="green">mdi-alpha-t-circle-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{this.$t('common.customize_theme')}</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      onClick={() => {
                        this.userMenu = false;
                      }}
                    >
                      <v-list-item-icon>
                        <v-icon color="yellow">mdi-alpha-s-circle-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{this.$t('common.setting')}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>

              {/* Message */}
              <v-tooltip
                top
                scopedSlots={{
                  activator: ({ on }: any) => (
                    <v-btn icon class={{ 'ml-2': !this.mini }} {...{ on }}>
                      <v-badge color="primary" content={this.messages} value={this.messages} overlap>
                        <v-icon>mdi-bell</v-icon>
                      </v-badge>
                    </v-btn>
                  ),
                }}
              >
                <span>{this.$t('common.new_message')}</span>
              </v-tooltip>

              {/** Theme */}
              <v-tooltip
                top
                scopedSlots={{
                  activator: ({ on }: any) => (
                    <v-btn
                      icon
                      class={{ 'ml-2': !this.mini }}
                      onClick={() => (this.currentDark = !this.currentDark)}
                      {...{ on }}
                    >
                      <v-icon>{this.currentDark ? 'mdi-brightness-4' : 'mdi-brightness-7'}</v-icon>
                    </v-btn>
                  ),
                }}
              >
                <span>{this.currentDark ? this.$t('common.dark') : this.$t('common.light')}</span>
              </v-tooltip>

              {/** Language */}
              <v-menu
                vModel={this.languageMenu}
                top
                offset-y
                close-on-content-click={false}
                origin="left botton"
                transition="scale-transition"
                scopedSlots={{
                  activator: ({ on: menuOn }: any) => (
                    <v-tooltip
                      top
                      scopedSlots={{
                        activator: ({ on: tooltioOn }: any) => (
                          <v-btn
                            icon
                            class={['subtitle-1', 'font-weight-medium', { 'ml-2': !this.mini }]}
                            {...{ on: { ...menuOn, ...tooltioOn } }}
                          >
                            {this.currentLanguage?.shortName}
                          </v-btn>
                        ),
                      }}
                    >
                      <span>{this.$t('common.language')}</span>
                    </v-tooltip>
                  ),
                }}
              >
                <v-list dense>
                  {languages.map((l: LangConfig) => (
                    <v-list-item
                      onClick={() => {
                        this.$router.replace({ params: { lang: l.alternate || l.locale } });
                      }}
                    >
                      <v-list-item-icon class="mr-2">
                        <v-icon v-show={this.currentLanguage === l}>mdi-check</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{l.name}</v-list-item-title>
                    </v-list-item>
                  ))}
                </v-list>
              </v-menu>
            </v-list-item>
          </div>
        </v-navigation-drawer>

        <v-app-bar color="primary" app dark>
          <v-app-bar-nav-icon
            class="hidden-md-and-up"
            onClick={() => {
              this.drawer = !this.drawer;
            }}
          />
          <v-tabs vModel={this.acticeTab} color="white" show-arrows>
            {this.tabs.map((tab, index) => (
              <v-tab to={tab.to} class={classes.nav} exact={tab.exact}>
                {this.$tv(String(tab.title))}
                {tab.closeable === true ? (
                  <v-icon small class={classes.navClose} onClick={(e: Event) => this.handleRemoveTab(e, index)}>
                    mdi-close
                  </v-icon>
                ) : null}
              </v-tab>
            ))}
          </v-tabs>
        </v-app-bar>

        <v-content class="content">
          <v-container fluid>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </v-container>
        </v-content>

        <v-dialog
          vModel={this.dialogShown}
          fullscreen={this.$vuetify.breakpoint.smAndDown}
          scrollable
          persistent
          width="560px"
        >
          {dialogComponent ? (
            <dialogComponent
              onClose={() => {
                this.dialogShown = false;
              }}
            />
          ) : null}
        </v-dialog>
      </v-app>
    );
  }
}
