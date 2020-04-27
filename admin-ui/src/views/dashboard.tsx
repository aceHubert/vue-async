import { DynamicComponent } from '@vue-async/module-loader';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import classes from './styles/dashboard.module';

const dynamicComponentStore = namespace('dynamicComponent');

@Component({
  name: 'dashboard',
  metaInfo: {
    title: 'Dashboard',
  },
})
export default class Index extends Vue {
  // route 注入
  @Prop(String) lang!: string;

  @dynamicComponentStore.State('dashboard') components!: { [name: string]: DynamicComponent };

  get sortComponents() {
    let index = 9999;
    return !this.components
      ? []
      : Object.entries(this.components)
          .map(([key, component]) => {
            let _component = component as any;
            if (!_component.component) {
              _component = {
                component,
              };
            }

            return Object.assign({}, { cols: 4, icon: 'mdi-menu', title: key, type: 'card' }, _component, {
              index: typeof _component.index === 'number' ? _component.index : ++index,
            });
          })
          .sort((a, b) => a.index - b.index);
  }

  render(h: any) {
    return (
      <v-container fluid class={classes.dashboard}>
        <v-row gutter={20}>
          {this.sortComponents.map(({ component: dynamicComponent, cols, icon, title, type }) => (
            <v-col cols="12" sm={cols * (12 / 8)} md={cols}>
              {type === 'none' ? (
                <dynamicComponent></dynamicComponent>
              ) : (
                <v-card class="mx-auto">
                  <v-card-title>
                    <v-icon class="mr-1">{icon}</v-icon>
                    <span class="body-2">{title}</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <dynamicComponent></dynamicComponent>
                  </v-card-text>
                </v-card>
              )}
            </v-col>
          ))}
        </v-row>
      </v-container>
    );
  }
}
