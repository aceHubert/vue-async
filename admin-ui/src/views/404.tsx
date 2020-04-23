import { Vue, Component } from 'vue-property-decorator';

@Component({
  name: 'not-found',
  metaInfo: {
    title: '404',
  },
})
export default class NotFound extends Vue {
  get moduleLoaded() {
    return this.$moduleLoadManager.loaded;
  }

  render(h: any) {
    return <v-container>{!this.moduleLoaded ? <h1>loading modules...</h1> : <h1>404</h1>}</v-container>;
  }
}
