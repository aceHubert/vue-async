import Vue, { PropType } from 'vue';

// Types
import { ResourceResult } from '@vue-async/resource-manager';

export default Vue.extend({
  props: {
    message: String as PropType<string>,
  },
  data(): { $dataRes: ResourceResult<never, string> | null } {
    return {
      $dataRes: null,
    };
  },
  methods: {
    createDataRes() {
      return this.createResource(
        () =>
          new Promise<string>((resolve) => {
            setTimeout(() => {
              resolve('data shows after 5s');
            }, 5000);
          }),
      );
    },
  },
  created() {
    this.$dataRes = this.createDataRes();
    this.$dataRes.read();
  },
  render() {
    const { $result: dataStr, $loading: dataLoading } = this.$dataRes!;

    return (
      <div>
        {dataLoading ? (
          <p>loading...</p>
        ) : (
          <p>
            {dataStr}
            {this.message ? `(${this.message})` : ''}
          </p>
        )}
      </div>
    );
  },
});
