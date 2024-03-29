# 模块化加载

## 安装
``` bash
yarn add @vue-async/module-loader
或者
npm i -S @vue-async/module-loader
```
<br>

## 使用方法
```js
// ## 主程序 ##

// 引入模块
import ModuleLoader from '@vue-async/module-loader';

/*
 * 注意：ES Module需要添加到`transpile`中编译
 * vue-cli 请添加到 vue.config.js 中的 transpileDependencies 上
 * nuxtjs 请添加到 nuxt.config.js 中的 build.transpile 上
 */

Vue.use(ModuleLoader);

// 方法一
var moduleLoader = new ModuleLoader({
  // 自定义扩展参数，
  fn:()=>{}
});

var app = new Vue({
  moduleLoader,
  render:(h)=> h(App)
})

app.$moduleLoader(ModuleConfig).then(()=>{
  app.$mount('#app')
})

// 方法二 (在 nuxtjs 的 plugin 中使用时)
var plugin = (context) => {
  var moduleLoader = new ModuleLoader({
    // 自定义扩展参数，
    fn:()=>{}
  });

  await moduleLoader.load(ModuleConfig)

  // 添加到 Vue options 中
  context.app.moduleLoader = moduleLoader
}
export default plugin

```
``` js
// ## 子模块 ##

// main.js 入口文件
export default function(Vue, options){}

// Typescript
import { VueConstructor } from 'vue';
import { ModuleContext } from '@vue-async/module-loader-typing';

export default function(Vue:VueConstructor, options: Recode<string, any> ={}){
  // do something
}
```
<br>

### ModuleConfig 配置
``` js
// 示例：

// 数组配置方式（支持与对象配置方式混合）
[
  // Key/Value
  {
    // 模块名称：远程 umd 文件 url 地址
    moduleName: 'remote url',
    moduleName: {
      entry: 'remote url', // 远程 umd 文件 url 地址
      styles: [], // 自定义样式文件（例如 ExtractTextPlugin extract:true时打成独立 css文件）
      args:{}
    }
  },
  // Object
  {
    moduleName: '',
    entry: '',
    styles:[],
    args:{}
  },
  // Function
  function entry(Vue){}
]

// or 对象配置方式
{
  moduleName: 'remote url',
  moduleName: {
    entry: 'remote url',
    styles: [],
    args:{}
  },
  function entry(Vue){}
}
```
<b>`moduleName`</b>  
Type: `string`    
umd 文件时打包时 lib 名, 必填项。


<b>`entry`</b>  
Type: `string`  
远程 umd 文件 url 地址， 必填项

<b>`styles`</b>  
Type: `string` | `string[]`  
如果打包时样式文件被分离，可以能过这里引用，可选项

<b>`args`</b>  
Type: `Object`  
参数将会传递到入口方法中的第二个参数，可选项（子模块需要判断 `undefined`）  
此参数与 `$moduleLoadManager` 区别在于此参数只会传递给单个子模块调用  
<br>

### options
<b>`sync`</b>  
Type: `Boolean`
子模块是否按同步的方式执行加载，即按List的顺序执行。

<b>`onLoading`</b>  
Type: `Function`  
参数: name: 模块名  
模块加载前

<b>`onLoaded`</b>  
Type: `Function`  
参数: name: 模块名  
模块加载成功


<b>`onError`</b>  
Type: `Function`  
参数: name: 模块名  
模块加载失败

<br>

## Vue 上下文注入方法 
<b>`this.$componentLoader(remote url)`</b>  
远程加载单个组件，返回 `Promise<VueComponent>`, 可作为 Vue 异步组件直接加载。  
<br>

<b>`this.$eventBus`</b>  
 父子模块通讯  

&nbsp;&nbsp;&nbsp; 方法：  
&nbsp;&nbsp;&nbsp; `emit(eventName,playload)` 触发事件  
&nbsp;&nbsp;&nbsp; `on(eventName, (playload)=>{})` 添加事件  
&nbsp;&nbsp;&nbsp; `off(eventName, (playload)=>{})` 移除事件  
&nbsp;&nbsp;&nbsp; `clean()` 移除所有事件  
&nbsp;&nbsp;&nbsp; `getEvents()` 获取所有事件  
<br>

<b>`this.$moduleLoadManager`</b>  
实例化 `ModuleLoader` 时的参数能过合并后的值, 支持 Vue 响应。  
注：在 Vue 被实例化之前加载子模块时，入口函数内无法调用到此对象  
&nbsp;&nbsp;&nbsp; 默认值：  
&nbsp;&nbsp;&nbsp; <b>`layouts`</b>  
&nbsp;&nbsp;&nbsp; Type: `Object`  
&nbsp;&nbsp;&nbsp; 通过 `addLayouts` 添加的模板对象

&nbsp;&nbsp;&nbsp; <b>`addLayouts(name:string, layout: VueComponent)`</b>  
&nbsp;&nbsp;&nbsp; 将组件模板添加到 `layouts` 中, 此方法可以在实例化参数中被覆盖重写  

&nbsp;&nbsp;&nbsp; <b>`addRoutes(routes:RouteConfig[])`</b>  
&nbsp;&nbsp;&nbsp; 添加路由, 主程序需要引用`vue-router`, 此方法可以在实例化参数中被覆盖重写  

##### <font color="red">注：当主组件引用`vue-router`包后，将会自动注入方法解决404问题，需要在主程序中添加一条配置 `name` 为 `404` `page-not-found` `not-found` 或 `path` 为 `*` 的路由后生效</font>
