# @vue-async/resource-manager

> React Suspense in Vue

## 安装

```bash
yarn add @vue-async/resource-manager@next
或者
npm i -S @vue-async/resource-manager@next
```

<br>

## 使用方法

```js
import { createResourceManager, ResourceManagerVuePlugin } from '@vue-async/resource-manager';

const resourceManager = createResourceManager();

// in Vue 2
import Vue from 'vue';
/*
 * mode
 * `Suspense` 组件显示模式
 * 可选值：'hidden' | 'visible'
 * 默认值：'visible'
 */
Vue.use(ResourceManagerVuePlugin, { mode: 'hidden' });

// in Vue 3
import { createApp } from 'vue';
const app = createApp(App);
app.use(ResourceManagerVuePlugin);
```

### createResource

> 创建一个 Resource 对象，返回 `read()`方法以及 `$result`, `$loading`, `$loaded`, `$error` 参数

```js
import { createResource } from '@vue-async/resource-manager';

const $resource = createResource((time)=>{
  return new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
});

// exec read
$resource.read(6)

// result
const { $result, $loading, $loaded, $error } = $resource;
```

`fetchFactory`  
异步 `fetch` 函数

`options`  
&nbsp;&nbsp;&nbsp; `prevent`  
&nbsp;&nbsp;&nbsp; type: `Boolean`  
&nbsp;&nbsp;&nbsp; default: `false`  
&nbsp;&nbsp;&nbsp; 在上一次执行未完成时，阻止当前执行。
<br>

&nbsp;&nbsp;&nbsp; `suspensible`  
&nbsp;&nbsp;&nbsp; type: `Boolean`  
&nbsp;&nbsp;&nbsp; type: `true`  
&nbsp;&nbsp;&nbsp; Suspense 在组件显示 fallback。
<br>

&nbsp;&nbsp;&nbsp; `onSuccess`  
&nbsp;&nbsp;&nbsp; type: `Function`  
&nbsp;&nbsp;&nbsp; `fetchFactory` 执行成功时对返回值的处理函数，如下拉继续加载数据时的合并操作。
<br>

&nbsp;&nbsp;&nbsp; `onError`  
&nbsp;&nbsp;&nbsp; type: `Function`  
&nbsp;&nbsp;&nbsp; `fetchFactory` 执行异常时对错误的处理函数，如记录错误日志。
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

### Suspense

> 处理异步组件和 createResource 中`fetchFactory`加载过程。

```js
// 建议Vue3中使用官方提供的`Suspense`组件。
import { Suspense, setSuspenseOptions } from '@vue-async/resource-manager';

// ChildComponent
export default defineComponent({
  props: ['message'],
  setup(props) {
    const $dataRes = createResource(
      (time = 3) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
      { suspensible: false },
    );

    $dataRes.read(6);

    return () => {
      const { $result: dataStr } = $dataRes;

      return (
        <p>
          {props.message ? `${props.message}: ` : ''} {dataStr}
        </p>
      );
    };
  },
});

// ParentComponent
export default defineComponent({
  setup() {
    const $dataRes = createResource(
      (time = 3) =>
        new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(`data shows after ${time}s`);
          }, time * 1000);
        }),
    );

    $dataRes.read(6);

    setSuspenseOptions({ mode: 'hidden' });

    return () => (
      <Suspense>{{
        default: () => <ChildComponent message="data" />,
        fallback: ()=> <p>loading...</p>
        }}
      </Suspense>
    );
  },
});

```

`props`  
&nbsp;&nbsp;&nbsp; `timeout`  
&nbsp;&nbsp;&nbsp; type: `Number`  
&nbsp;&nbsp;&nbsp; default: `-`  
&nbsp;&nbsp;&nbsp; 显示 fallback 延时时间。
<br>
<br>

`events`  
&nbsp;&nbsp;&nbsp; `resolve`  
&nbsp;&nbsp;&nbsp; 当所有子组件中 `createResource` fetchFactory 执行完成时触发。
<br>

&nbsp;&nbsp;&nbsp; `pending`  
&nbsp;&nbsp;&nbsp; 当 `Suspense` 处于等待时触发。
<br>

&nbsp;&nbsp;&nbsp; `fallback`  
&nbsp;&nbsp;&nbsp; 当 `fallback` 显示时触发。
<br>
<br>

`slot`  
&nbsp;&nbsp;&nbsp; `fallback`  
&nbsp;&nbsp;&nbsp; 在加载过程中显示的组件，通常是显示一个 `loading` 组件。
<br>

&nbsp;&nbsp;&nbsp; `error`  
&nbsp;&nbsp;&nbsp; 在 fetchFactory 执行错误时显示的组件。
