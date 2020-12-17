import { Vue, Component } from 'vue-property-decorator';
import CreateResource from '../components/CreateResource';

const LazyLoad1 = Vue.lazy(() => import('../components/Load1'));
const LazyLoad2 = Vue.lazy(() => import('../components/Load2'), { message: String });

@Component
export default class Index extends Vue {
  visible = false;

  handleVisible(e: any) {
    this.visible = e.target.checked;
    Vue.setSuspenseOptions({ mode: this.visible ? 'visible' : 'hidden' });
    this.$forceUpdate();
  }

  render() {
    return (
      <div id="app">
        <div>
          <h2>createResource:</h2>
          <CreateResource />
        </div>
        <div>
          <h2>lazy:</h2>
          <div>
            <label>
              <input type="checkbox" onChange={this.handleVisible} />
              mode: {this.visible ? 'visible' : 'hidden'}
            </label>
          </div>
          <suspense>
            {/* @ts-ignore */}
            <LazyLoad1 message="Lazy Load 1" />
            {/* @ts-ignore */}
            <LazyLoad2 message="Lazy Load 2" />
            <p slot="fallback">loading...</p>
          </suspense>
        </div>
      </div>
    );
  }
}
