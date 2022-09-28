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

### 直接应用到 `axios instance`

> `apply` 系列方法使用 [`axios interceptors`](https://axios-http.com/docs/interceptors) 处理，如果有自定义 `interceptors` 不能改变返回类型，处理方法对`AxiosResponse`、`AxiosError`存在依赖。  
> 问题：`CanceledError` 错误少了 `config` 参数，无法确认用户传入的处理条件。

```javascript
import axios from 'axios'
import { applyLoading, applyRetry, applyCatchError } from '@vue-async/fetch-axios'

const axiosInstance = axios.create({})

// loading
applyLoading(axiosInstance,{
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
applyRetry(axiosInstance, {
   maxCount: 3, // 重试次数
   delay: true, // 重试延迟
   validateError: (err)=> true // 触发retry的条件
})

axiosInstance.request({
  retry: true // 是否使用 retry, 或自定义设置重写 registRetry 参数
}）

// catchError
applyCatchError(axiosInstance,{
    // 当接口通过body返回异常消息，可通过此方法判断
    serializerData(data){
      if(data.success){
        return data.data
      }else{
        return Promise.reject(new Error(data.message))
      }
    },
  handler: (err)=> new Promise(()=>{}) // 全局catch error 方法，默认会阻止往后执行
})

axiosInstance.request({
  catchError: true // 是否启用catch error
}）

```

#### 在 `@vue-async/fetch` 使用插件注册

> `use` 方法是应用到所有通过 `defineRegistApi` 定义的方法。  
> 通过 `defineRegistApi` 的 `plugins` 定义，则只应用在当前定义的方法中

```javascript
import { createApp } from 'vue';
import axios from 'axios';
import { createFetch, defineRegistApi } from '@vue-async/fetch';
import { createCatchErrorPlugin, createLoadingPlugin, createRetryPlugin } from '@vue-async/fetch-axios';

const axiosInstance = axios.create({});

const fetch = createFetch(axiosInstance);

fetch.use(
  createCatchErrorPlugin({
    // 当接口通过body返回异常消息，可通过此方法判断
    // 注意：如果有全局自定义 interceptors，在 request 中不能改变返回的类型，data 参数为 AxiosResponse data 参数
    serializerData(data){
      if(data.success){
        return data.data
      }else{
        return Promise.reject(new Error(data.message))
      }
    },
    handler: (error)=>{
      // 处理异常

      // 阻止接口继续执行
      return new Promise((resolve)=>{})
    }
  })
)

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
  })
)

fetch.use(
  createRetryPlugin({
     maxCount: 3, // 重试次数
     delay: true, // 重试延迟
     validateError: (err)=> true // 触发retry的条件
  })
)

// 定义 registApi
const useUserApi = defineRegistApi('user', {
  apis: {
    getUser: 'get /user',
  },
  plugins:[
    createCatchErrorPlugin({
      ...
    }),
    createLoadingPlugin({
      ...
    }),
    createRetryPlugin({
      ...
    })
  ]
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


// 在Vue中使用请查看"@vue-async/fetch"文档
const app = createApp({});
app.use(fetch);
app.mount('#app');
```
