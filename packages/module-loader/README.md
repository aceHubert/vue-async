# 模块化加载

## 安装

```bash
yarn add @vue-async/module-loader@next
或者
npm i -S @vue-async/module-loader@next
```

<br>

## 使用方法

### 主程序

```ts
import { createLoader, ModuleLoaderVuePlugin, registerSubModules } from '@vue-async/module-loader';

const moduleLoader = createLoader(...options);

// In Vue2
Vue.use(ModuleLoaderVuePlugin);

// In Vue3
app.use(moduleLoader);

const start = registerSubModules([]);

start(router).then(() => {
  // do something
});
```

### 子模块

```ts
// index.ts
import { defineBootstrap, defineMount, defineUnmount } from '@vue-async/module-loader/sub';

export const bootstrap = defineBootstrap(app: App){
  // do something
})

export const mount = defineMount(app: App, props: Props){
  // do something

  // return some properties to main module
  return {};
})

// only works in Vue3
export const unmount = defineUnmount(app:App, props: Props){
  // do something
})
```

<br>

### ModuleConfig 配置

```ts
// 数组配置方式（支持与对象配置方式混合）
[
  // Remote module
  {
    moduleName: 'remote url', // equal to {name:"moduleName", entry: 'remote url'}
    moduleName: {
      entry: 'remote url', 
      styles: [], 
      props:{}
    }
  },
  {
    name: '',
    entry: 'remote url',
    styles:[],
    activeRule: '/app1',
    props:{}
  },
  // Functional module
  function bootstrap(Vue){
    // return some properties to main module
    return {}
  }
]
```

<b>`name`</b>  
Type: `string`  
Required: `true`  
export name from umd file, .

<b>`entry`</b>  
Type: `string`  
Required: `true`  
remoet script src.

<b>`styles`</b>  
Type: `string` | `string[]`  
Required: `false`  
style file(s)（ExtractTextPlugin {extract:true} to export a single css file）, `Optional`.

<b>`activeRule`</b>  
Type: `string` | `(location: Location) => boolean`  
Required: `false`  
active rule if you use vue-router,   
load modules when path match prefix string or function return true.

<b>`props`</b>  
Type: `Object`    
Required: `false`  
pass properties to sub module.
<br>


