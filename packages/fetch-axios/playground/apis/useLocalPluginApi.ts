import { defineRegistApi, typedUrl } from '@vue-async/fetch';
import { createCatchErrorPlugin } from '@vue-async/fetch-axios';

export const useLocalPluginApi = defineRegistApi('plugin', {
  apis: {
    error400: typedUrl<string>`/error`,
  },
  prefix: 'http://localhost:7009',
  plugins: [
    createCatchErrorPlugin({
      handler(error) {
        if (
          Object.prototype.toString.call(error.response?.data) === '[object Object]' &&
          (error.response?.data as any).code === '400'
        ) {
          alert(`error from local plugin`);
        }
        return new Promise(() => {});
      },
    }),
  ],
});
