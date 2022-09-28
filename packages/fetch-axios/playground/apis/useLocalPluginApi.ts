import axios from 'axios';
import { defineRegistApi, typedUrl } from '@vue-async/fetch';
import { createCatchErrorPlugin } from '@vue-async/fetch-axios';

export const useLocalPluginApi = defineRegistApi('plugin', {
  apis: {
    error400: typedUrl<string>`/error`,
    bodyError: typedUrl<string>`/body-error`,
  },
  prefix: 'http://localhost:7009',
  plugins: [
    createCatchErrorPlugin({
      serializerData: (data: any) => {
        if (data.success !== void 0) {
          if (data.success) {
            return data.data;
          } else {
            return Promise.reject(new Error(data.message));
          }
        }
        return data;
      },
      handler(error) {
        if (
          axios.isAxiosError(error) &&
          Object.prototype.toString.call(error.response?.data) === '[object Object]' &&
          (error.response?.data as any).code === '400'
        ) {
          // http code error, and message from data
          alert(`local error handler from local plugin, ${(error.response?.data as any).message || ''}`);
        } else {
          alert(`local error handler from local plugin, ${error?.message || ''}`);
        }
        return new Promise(() => {});
      },
    }),
  ],
});
