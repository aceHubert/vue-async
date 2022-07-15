## @vue-async/fetch

> `Vue 3.x` or `Vue 2.16.x + @vue/composition-api`

## 安装

```bash
yarn add @vue-async/fetch
或者
npm i -S @vue-async/fetch
```

<br>

## 使用

```javascript
// 直接使用
import axios from 'axios';
import { regisApi, defineApi } from '@vue-async/fetch';

export const apiConfig = defineApi({
  getUsers: typedUrl<User[]>`get /users`, 
  // get 可以省略
  getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`, 
  addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
});

const axiosInstance = axios.create({
  timeout: 5000
})
const prefix = 'http://api/base_url'

const apis = registApi(axiosInstance, apiConfig, prefix);

apis.getUsers().then(({data})=>{ console.log(data)});
// params 参数
apis.getUsers({ params:{id:1} }).then(({data})=>{ console.log(data)});
// body 参数 
apis.addUser({ data:{ id:1,name:'张三' }}).then(({data})=>{ console.log(data)});

```

```javascript
// Vue2
import Vue from 'vue'
import { createFetch, FetchVuePlugin } from '@vue-async/fetch';

Vue.use(FetchVuePlugin);

const fetch = createFetch(axiosInstance,{
  apis: apiConfig,
  prefix
})

new Vue({
  ...
  fetch,
}).$mount('#app')

// 组件内使用
{
  created(){
    this.$fetch.client // => axiosInstance from createFetch
    this.$fetch.registApis // => 使用 registApi 方法返回的 apis
  }
}
// 或者
{
  inject:['fetch'],
  created(){
    this.fetch
  }
}
```

```javascript
// Vue3
import { createApp } from 'vue'
import { createFetch } from '@vue-async/fetch';

const fetch = createFetch(axiosInstance,{
  apis: apiConfig,
  prefix
})

const app = createApp({
  ...
})

app.use(fetch)

// 组件内使用
import { useFetch } from '@vue-async/fetch';

type ApiConfig = typeof apiConfig;

defineComponent({
  setup(){
    const fetch = useFetch<ApiConfig>();
    fetch.client // => axiosInstance from createFetch
    fetch.registApis // => 使用 registApi 方法返回的 apis
  }
})
```