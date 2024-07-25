# Resource Manager

> Resource Manager for Vue3

## Install

```bash
yarn add @vue-async/resource-manager@next
or
npm i -S @vue-async/resource-manager@next
```

<br>

## Usage

```js
import { createResourceManager, ResourceManagerVuePlugin } from '@vue-async/resource-manager';

const resourceManager = createResourceManager();

// in Vue 2
import Vue from 'vue';
/*
 * mode
 * Suspense Component display mode
 * Options：'hidden' | 'visible'
 * Default：'visible'
 */
Vue.use(ResourceManagerVuePlugin, { mode: 'hidden' });

// in Vue 3
import { createApp } from 'vue';
const app = createApp(App);
app.use(ResourceManagerVuePlugin);
```

### createResource

> Create a `Resource`，return `read()` method and `$result`, `$loading`, `$loaded`, `$error` status.

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

`options`

| Prop          | Type       | Default | Required | Description                                                       |
| ------------- | ---------- | ------- | -------- | ----------------------------------------------------------------- |
| `prevent`     | `Boolean`  | `false` | `false`  | Return lastest uncomplete `fetchFactory` and stop current request |
| `suspensible` | `Boolean`  | `true`  | `false`  | Show status in Suspense component                                 |
| `onSuccess`   | `Function` | `-`     | `false`  | Success callback function                                         |
| `onError`     | `Function` | `-`     | `false`  | Error callback function                                           |

<br>

`Return`
| Prop | Description |
| ---------- | ---------------------------------------------- |
| `read` | execute `fetchFactory` |
| `$result` | `fetchFactory` resolved value |
| `$loading` | `fetchFactory` is executing |
| `$loaded` | `fetchFactory` has been executed at least once |
| `$error` | `fetchFactory` rejected |

<br/>
<br/>

### Suspense

> Shown createResource `fetchFactory` status

```js
// 建议Vue3中使用官方提供的`Suspense`组件。
import { Suspense } from '@vue-async/resource-manager';

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
| Prop | Type | Default | Requried | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `timeout` | `Number` | `-` | `false` | Show fallback delay time |

<br/>

`events`
| Prop | Description |
| ---- | ----------- |
| `resolve` | When all `createResource` fetchFactory executed |
| `pending` | When `Suspense` is waiting |
| `fallback` | When `fallback` is showing |

<br/>

`slot`
| Prop | Description |
| ---- | ----------- |
| `fallback` | `Suspense` fallback content |
| `error` | `Suspense` error content |
