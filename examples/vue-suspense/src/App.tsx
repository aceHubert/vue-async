import { Component, Vue } from 'vue-property-decorator';
import { lazy } from '@vue-async/resource-manager';
import CreateResource from './components/CreateResource';

const Demo1 = lazy(() => import('./components/LazyLoad1')) as typeof Vue;
const Demo2 = lazy(() => import('./components/LazyLoad2')) as typeof Vue;

@Component
export default class App extends Vue {
  render() {
    return (
      <div id="app">
        <div>
          <h2>createResource:</h2>
          <CreateResource />
        </div>
        <div>
          <h2>lazy:</h2>
          <suspense>
            <Demo1 />
            <Demo2 />
            <p slot="fallback">loading...</p>
          </suspense>
        </div>
      </div>
    );
  }
}
