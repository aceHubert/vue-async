import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Load1 extends Vue {
  @Prop(String) message?: string;

  dataStr = '';

  createDataRes() {
    return this.createResource(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('data shows after 3s');
          }, 3000);
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
    return (
      <p>
        {' '}
        {this.dataStr} {this.message ? `(${this.message})` : ''}
      </p>
    );
  }
}
