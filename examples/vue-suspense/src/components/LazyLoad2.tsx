import { Component, Vue } from 'vue-property-decorator';
import { createResource } from '@vue-async/resource-manager';

@Component
export default class CreateResource extends Vue {
  dataStr = '';

  createDataRes() {
    return createResource(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('data shows after 6s');
          }, 6000);
        }),
    );
  }

  created() {
    const $dataRes = this.createDataRes();
    $dataRes.read().then((data) => {
      this.dataStr = data;
    });
  }

  render() {
    return <p>{this.dataStr}</p>;
  }
}
