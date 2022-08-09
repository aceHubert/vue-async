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