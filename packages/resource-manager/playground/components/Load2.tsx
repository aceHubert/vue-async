import Vue from 'vue';

export default Vue.extend({
  props: ['message'],
  data() {
    return {
      dataStr: '',
    };
  },
  methods: {
    createDataRes() {
      return this.createResource(
        (n: number, message?: string) =>
          new Promise<string>((resolve) => {
            setTimeout(() => {
              resolve(`data shows after ${n}s${message ? `, message${message}` : ''}`);
            }, n * 1000);
          }),
      );
    },
  },
  created() {
    const $dataRes = this.createDataRes();
    $dataRes.read(6).then((data) => {
      this.dataStr = data;
    });
  },
  render() {
    return (
      <p>
        {this.dataStr} {this.message ? `(${this.message})` : ''}
      </p>
    );
  },
});
