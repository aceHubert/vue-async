## @vue-async/fetch-axios

> Axios adapter and typing for `@vue-async/fetch`

## 安装

```bash
yarn add @vue-async/fetch-axios
或者
npm i -S @vue-async/fetch-axios
```

<br>

## 使用

```javascript
import axios from 'axios'
import { registLoading, registRetry, registCatchError } from '@vue-async/fetch-axios'

const axiosInstance = axios.create({})

// loading
registLoading(axiosInstance,{
  delay: 260, // 延迟显示，如果接口在设置时间内返回则不调用handler方法
  handler: ()=>{ // 显示loading的处理方法
    // 显示 loading
    return ()=>{
      // 隐藏 loading
    }
  }
})

axiosInstance.request({
  loading: true // 是否显示loading, 或自定义设置当前loading handler方法
})

// retry
registRetry(axiosInstance, {
   maxCount: 3, // 重试次数
   delay: true, // 重试延迟
   validateError: (err)=> true // 触发retry的条件
})

axiosInstance.request({
  retry: true // 是否使用 retry, 或自定义设置重写 registRetry 参数
}）

// catchError
registCatchError(axiosInstance,{
  handler: (err)=> new Promise(()=>{}) // 全局catch error 方法，默认会阻止往后执行
})

axiosInstance.request({
  catchError: true // 是否启用catch error
}）

```

#### 在 `@vue-async/fetch` 使用插件注册

```javascript
import { createApp } from 'vue';
import axios from 'axios';
import { createFetch, defineRegistApi } from '@vue-async/fetch';
import { createLoadingPlugin } from '@vue-async/fetch-axios';

const axiosInstance = axios.create({});

const fetch = createFetch(axiosInstance);

// 仅注册到 regist apis 上
fetch.use(
  createLoadingPlugin({
    delay: 260, // 延迟显示，如果接口在设置时间内返回则不调用handler方法
    handler: () => {
      // 显示loading的处理方法
      // 显示 loading
      return () => {
        // 隐藏 loading
      };
    },
  }),
);

// 定义 registApi
const useUserApi = defineRegistApi('user', {
  apis: {
    getUser: 'get /user',
  },
});

const useApi = useUserApi();

// 使用registApi
useApi.getUser({
  // loading 生效
  loading: true,
});

// fetch.client 指向是 axiosInstance
fetch.client.get('/user', {
  // loading 不生效
  loading: true,
});

const app = createApp({});
// *必须使用use后插件才会生效
app.use(fetch);
app.mount('#app');
```
