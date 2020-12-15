# @vue-async/module-loader

从远程地址链接加载`模块`.  
<br>

```js
// ## 主程序 ##

// 引入模块
import ModuleLoader from '@vue-async/module-loader';

Vue.use(ModuleLoader);

// 方法一
var moduleLoader = new ModuleLoader({});

var app = new Vue({
  moduleLoader,
  render:(h)=> h(App)
})

app.$moduleLoader(ModuleConfig).then(()=>{
  app.$mount('#app')
})

// 方法二 (例如在 nuxtjs 的 plugin 中使用时)
var plugin = (context) => {
  // 这里需要手动注册 dynamicComponent，
  // 子模块中才可以能过 this.$dynamicComponent.add()方法
  var moduleLoader = 
    new ModuleLoader({}).registerDynamicComponent(context.store);

  await moduleLoader.load(ModuleConfig)

  // 添加到 Vue options 中
  context.app.moduleLoader = moduleLoader
}
export default plugin
```
``` js
// ## 子模块 ##
// index.js 入口文件
export default function(Vue, options){}

// Typescript
import { VueConstructor } from 'vue';
import { ModuleContext } from '@vue-async/module-loader-typing';

// 方法一调用方式
export default function(this:InstanceType<VueConstructor>, Vue:VueConstructor, options: Recode<string, any> ={}){}

// 方法二调用方式
export default function(this:ModuleContext, Vue:VueConstructor, options: Recode<string, any> ={}){}
```

## ModuleConfig 模块配置

示例：
``` js
// 数组配置方式（支持与对象配置方式混合）
[
  // Key/Value
  {
    // 模块名称：远程 umd 文件 url 地址
    moduleName: 'remote url',
    //
    moduleName: {
      entry: 'remote url', // 远程 umd 文件 url 地址
      styles: [],
      args:{}
    }
  },
  // Object
  {
    moduleName: '',
    entry: '',
    styles:[]
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
`moduleName`  
Type: `string`    
umd 文件时打包时 lib 名, 必填项。


`entry`  
Type: `string`  
远程 umd 文件 url 地址， 必填项

`styles`  
Type: `string` | `string[]`  
如果打包时样式文件被分离，可以能过这里引用，可选项

`args`  
Type: `Object`  
参数将会传递到入口方法中的第二个参数，可选项（子模块需要判断 `undefined`）  
此参数与 `$moduleLoaderManager` 区别在于此参数只会传递给单个子模块调用  
<br>

## 子模块上下文方法 
`this.$componentLoader(remote url)`  
远程加载单个组件，返回 `Promise<VueComponent>`, 可作为 Vue 异步组件直接加载。  
<br>

`this.$eventBus`  
 父子模块通讯  

&nbsp;&nbsp;&nbsp; 方法：  
&nbsp;&nbsp;&nbsp; `emit(eventName,playload)` 触发事件  
&nbsp;&nbsp;&nbsp; `on(eventName, (playload)=>{})` 添加事件  
&nbsp;&nbsp;&nbsp; `off(eventName, (playload)=>{})` 移除事件  
&nbsp;&nbsp;&nbsp; `clean()` 移除所有事件  
&nbsp;&nbsp;&nbsp; `getEvents()` 获取所有事件  
<br>

`this.$dynamicComponent`  
子模块注册动态组件到主程序 `store` namespace `dynamicComponent` 中  
当使用方法一在 `new Vue({})` 之后调用时，如果引用了 `vuex` 将会自动注入此方法  
当使用方法二在之前调用时，需要手动 `registerDynamicComponent(store)` 之后才可以被调用  

&nbsp;&nbsp;&nbsp; 方法：  
&nbsp;&nbsp;&nbsp; `add(component, position)` 添加组件到指定的位置  
&nbsp;&nbsp;&nbsp; `remove(name, position)` 从指定位置移除指定名字组件  
&nbsp;&nbsp;&nbsp; 注意：  
&nbsp;&nbsp;&nbsp; `component`: 需要配置 `name` 属性 或 通过 `{ name: '', component: Compnent }` 自定义名称，移出时通过 name 移除  
&nbsp;&nbsp;&nbsp; `position` 可选项， 默认值：'GLOBAL'  
<br>

`this.$moduleLoadManager`  
实例化 `ModuleLoader` 时的参数能过合并后的值, 支持 Vue 响应。  
注：在 Vue 被实例化之前加载子模块时，入口函数内无法调用到此对象  
默认值：  
`layouts`  
Type: `Object`
模板对象

`addLayouts(name:string, layout: VueComponent)`  
将组件模板添加到 `layouts` 中, 此方法可以在实例化参数中被覆盖重写  

`addRoutes(routes:RouteConfig[])`  
添加路由, 主程序需要引用`vue-router`, 此方法可以在实例化参数中被覆盖重写  

注：当主组件引用`vue-router`包后，将会自动注入方法解决404问题，需要在主程序中添加一条配置 `name` 为 `404` `page-not-found` `not-found` 或 `path` 为 `*` 的路由后生效

<br>
<br>
<br>

## <font color="red">问题</font>
1、webpack 打包 Can't resolve "module"  
``` json
  {
    node:{
      module:'empty'
    }
  }
```



