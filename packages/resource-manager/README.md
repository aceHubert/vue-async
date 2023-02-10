# @vue-async/resource-manager

> React Suspense in Vue

## 安装

```bash
yarn add @vue-async/resource-manager
或者
npm i -S @vue-async/resource-manager
```

<br>

## 使用方法

```js
import Vue from 'vue';
import ResourceManager from '@vue-async/resource-manager';

/*
 * mode
 * `Suspense` 组件显示模式  
 * 可选值：'hidden' | 'visible'  
 * 默认值：'visible'
 */
Vue.use(ResourceManager, { mode: 'hidden' });
```

```js
// 父组件
import Child1 from 'child1'
import Child2 from 'child2'

{
  ...,
  render(){
    return <suspense>
      <Child1/>
      <Child2/>
      <div slot="fallback">loading</div>
    </suspense>
  }
}

// 或者

const Child1 = Vue.lazy(()=>import('child1'))
const Child2 = Vue.lazy(()=>import('child2'))

{
  ...,
  render(){
    return <suspense>
      <Child1/>
      <Child2/>
      <div slot="fallback">loading</div>
    </suspense>
  }
}


// 子组件
{
  ...,
  created(){
    this.$data = this.createResource((params)=>http.get('...'))
    this.$data.read({...params})
  },
  render(){
    // 参数是 Vue 响应的
    const {$result, $loading, $error} = this.$data

    return <div></div>
  }
}
```
<br>

## Vue 上下文注入方法 
<b>`this.createResource(fetchFactory, options)`</b>  
创建一个 Resource 对象，返回 `read()`方法以及 `$result`, `$loading`, `$loaded`, `$error` 参数  

`fetchFactory`   
异步 `fetch` 函数

`options`  
&nbsp;&nbsp;&nbsp; `prevent`  
&nbsp;&nbsp;&nbsp; type: `Boolean`  
&nbsp;&nbsp;&nbsp; 在上一次执行未完成时，阻止当前执行  

&nbsp;&nbsp;&nbsp; `onSuccess`  
&nbsp;&nbsp;&nbsp; type: `Function`  
&nbsp;&nbsp;&nbsp; `fetchFactory` 执行成功时对返回值的处理函数  

&nbsp;&nbsp;&nbsp; `onError`  
&nbsp;&nbsp;&nbsp; type: `Function`  
&nbsp;&nbsp;&nbsp; `fetchFactory` 执行异常时对错误的处理函数  
<br>
`Returns`  
&nbsp;&nbsp;&nbsp; `read(input)`  
&nbsp;&nbsp;&nbsp; 执行`fetchFactory`, `input`参数将会传给`fetchFactory`  

&nbsp;&nbsp;&nbsp; 以下参数都已经支持 Vue 响应  
&nbsp;&nbsp;&nbsp; `$result`：`fetchFactory` resolved 的值  
&nbsp;&nbsp;&nbsp; `$loading`：`fetchFactory` 在执行中  
&nbsp;&nbsp;&nbsp; `$loaded`：`fetchFactory` 已经被执行过至少一次  
&nbsp;&nbsp;&nbsp; `$error`：`fetchFactory` 执行错误

<br/>

## Vue 对象上注入方法
<b>`Vue.lazy(asyncFactory, propsDef)`</b>  
加载异步组件，可参考`React.lazy()`说明  
区别于 Vue 的异步组件在于当使用在 `Suspense` 中时，异步组件的加载过程也会被计算

<b>`Vue.setSuspenseOptions(options)`</b>  
修改 `Suspense` 的参数, `options` 同 Vue.use 时设置的参数一致  

<br>

## Vue 注册的组件
`Suspense`  
处理异步组件和createResource中`fetchFactory`加载过程

&nbsp;&nbsp;&nbsp; `slot`:  
&nbsp;&nbsp;&nbsp; `fallback`  
&nbsp;&nbsp;&nbsp; 在加载过程中显示的组件，通常是显示一个 `loading` 组件  
  
