## @vue-async/fetch

> 在 `Vue 3.x` or `Vue 2.16.x + @vue/composition-api` 中使用，  
> 同时支持在Vue实例外调用，以及手动控制当前激活的fetch对象

## 安装

```bash
yarn add @vue-async/fetch
或者
npm i -S @vue-async/fetch
```

<br>

## 使用

### 直接使用
```javascript
// 使用 axios 作为示例
import axios from 'axios';
import { regisApi } from '@vue-async/fetch';

const axiosInstance = axios.create({
  timeout: 5000
})

const prefix = 'http://api/base_url'
const userApi = registApi(axiosInstance, {
  getUsers: typedUrl<User[]>`get /users`,
  // get 可以省略
  // 通过取对象字符串
  getUser: typedUrl<User, { id: string | number }>`/user/${'id'}`,
  // 或者通过函数拼接url
  getUser: typedUrl<User, { id: string | number }>`/user/${(params)=> params.id}`,
  addUser: typedUrl<User, any, Partial<Omit<User, 'id'>>>`post /user`,
}, prefix);

userApi.getUsers().then(({data})=>{ console.log(data)});
// params 参数
userApi.getUsers({ params:{id:1} }).then(({data})=>{ console.log(data)});
// body 参数
userApi.addUser({ data:{ id:1,name:'张三' }}).then(({data})=>{ console.log(data)});

```

```javascript
// Vue2
import Vue from 'vue'
import { createFetch, defineRegistApi, setActiveFetch, FetchVuePlugin } from '@vue-async/fetch';

Vue.use(FetchVuePlugin);

const afetch = createFetch(axiosInstance)

// 注册 registApi 插件
afetch.use(plugin)

// 定义 regsitApi
const useUserApi = defineRegistApi('user',{
  apis:{
    getUsers: typedUrl<User[]>`get /users`
  }
})

new Vue({
  ...
  afetch,
}).$mount('#app')

// 组件内使用
{
  created(){
    this.$afetch.client // => axiosInstance from createFetch

    //激活当前使用的fetch对象
    setActiveFetch(afetch)
    // 使用user api
    const userApi = useUserApi();
    // 或使用其它的fetch对象注册regist api
    const userApi = useUserApi(afetch);
    userApi.getUsers()
  }
}
// 或者
{
  inject:{
    'afetch':{from: fetchSymbol}
  },
  created(){
    this.afetch
  }
}


// 在 @vue/composition-api 中使用 registApi
import { defineComponent } from '@vue/composition-api'

defineComponent({
  setup(){
    const userApi = useUserApi();
    userApi.getUsers()
  }
})
```

```javascript
// Vue3
import { createApp, defineComponent } from 'vue'
import { createFetch, defineRegistApi } from '@vue-async/fetch';

const afetch = createFetch(axiosInstance)

const app = createApp({
  ...
})
// install fetch
app.use(afetch)

// 注册 registApi 插件
afetch.use(plugin)

// 定义 regsitApi
const useUserApi = defineRegistApi('user',{
  apis:{
    getUsers: typedUrl<User[]>`get /users`
  },
  prefix: '/'
})

// 组件内使用
defineComponent({
  setup(){
    const userApi = useUserApi();
    userApi.getUsers()
  }
})
```
