import { Component, Mixins } from 'vue-property-decorator';
import { MixinLang } from '@/mixins';

@Component({
  name: 'test',
  metaInfo: {
    title: 'test',
  },
})
export default class Test extends Mixins(MixinLang) {
  render(h: any) {
    return (
      <div>
        <h1>{this.$t('lang')}</h1>
        <router-link to={{ name: 'index' }}>Index</router-link>
        <br />
        <router-link to="/">Index</router-link>
        <br />
        <router-link to={{ name: 'test', query: { newtab: true } }}>NewTab</router-link>

        <v-radio-group value={this.locale} mandatory={false} onChange={this.setLanguage}>
          {this.supportLanguages.map(config => (
            <v-radio label={config.name} value={config.alternate || config.locale}></v-radio>
          ))}
        </v-radio-group>
      </div>
    );
  }
}
