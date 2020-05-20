import { Component, Vue } from 'vue-property-decorator';
import { ResourceResult, createResource } from '@vue-async/resource-manager';

@Component
export default class CreateResource extends Vue {
  $dataRes!: ResourceResult<never, string>;

  createDataRes() {
    return createResource(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('data shows after 5s');
          }, 5000);
        }),
    );
  }

  created() {
    this.$dataRes = this.createDataRes();
    this.$dataRes.read();
  }

  render() {
    const { $result: dataStr, $loading: dataLoading } = this.$dataRes;

    return <div>{dataLoading ? <p>loading...</p> : <p>{dataStr}</p>}</div>;
  }
}
