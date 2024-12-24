# Module Loader

## Install

```bash
yarn add @vue-async/module-loader@next
or
npm i -S @vue-async/module-loader@next
```

<br>

## Usage

### Main program

```ts
import { createLoader, ModuleLoaderVuePlugin, registerSubModules } from '@vue-async/module-loader';

const moduleLoader = createLoader(...options);

moduleLoader
// Set global options
.setOptions(
  ...options,
  // handle register properties returned by sub modules mount lifecycle
  register: (options) => {
    // need handle the router resolve by yourself
    router.addRoutes(options.routes);
  },)
// Add error handler
.addErrorHandler(errorHandler)
// Remove error handler
.removeErrorHandler(errorHandler);

// In Vue2
Vue.use(ModuleLoaderVuePlugin);

// In Vue3
app.use(moduleLoader);

```

### moduleLoader `setOptions`

> Set global options

| Prop       | Type       | Required | Description                                                                                   |
| ---------- | ---------- | -------- | --------------------------------------------------------------------------------------------- |
| `loading`  | `Function` | `false`  | When sub module(s) activing, return a function to close loading                               |
| `register` | `Function` | `false`  | When sub module(s) `mount` lifecycle return properties that needs to register in main program |

### moduleLoader `addErrorHandler` `removeErrorHandler`

> Add/Remove global error handler

```ts
// error handler
 errorHandler: (error: Error, moduleName: string) => void
```

<br>
<br>

### Register SubModules

```ts
import { registerSubModules } from '@vue-async/module-loader';
// Register sub modules
const useSubModules = registerSubModules(ModuleConfig[], lifeCycles);


// in Vue instance
const submodules = useSubModules();
// out of Vue instance
const submodules = useSubModules(moduleLoader);

// start sub modules loading
submodules.start({router}).then(() => {
  // do something
});
```

### registerSubModules `ModuleConfig`

```ts
// Example:
[
  // Remote module
  {
    moduleName: 'remote url', // equal to {name:"moduleName", entry: 'remote url'}
    moduleName: {
      entry: 'remote url',
      styles: [],
      props: {},
    },
  },
  {
    name: '',
    entry: 'remote url',
    styles: [],
    activeRule: '/app1',
    props: {},
  },
  // Functional module
  function bootstrap(Vue) {
    // return some properties to main module
    return {};
  },
];
```

| Prop         | Type                                            | Required | Description                                                                   |
| ------------ | ----------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `name`       | `string`                                        | `true`   | export name from umd file                                                     |
| `entry`      | `string`                                        | `true`   | remote script src                                                             |
| `styles`     | `string`                                        | `false`  | style file(s)（ExtractTextPlugin {extract:true} to export a single css file） |
| `activeRule` | `string` <br> `(location: Location) => boolean` | `false`  | active rule if you use vue-router, load modules when path match prefix string |
| `props`      | `Object`                                        | `false`  | pass properties to sub modules                                                |

### registerSubModules `LifeCycles`

| lifecycle       | Description              |
| --------------- | ------------------------ |
| `beforeLoad`    | before bootstrap execute |
| `beforeMount`   | before mount execute     |
| `afterMount`    | after mount execute      |
| `beforeUnmount` | before unmount execute   |
| `afterUnmount`  | after unmount execute    |

### start `Options`

| name       | Type        | Required | Description                                                                                                  |
| ---------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `router`   | `VueRouter` | false    | vue-router instance, will use beforeEach/afterEach if set, otherwise will use popstate/beforeunload listener |
| `loading`  | `Function`  | `false`  | Override moduleLoader options                                                                                |
| `register` | `Function`  | `false`  | Override moduleLoader options                                                                                |

<br>
<br>

### SubModule definition

```ts
// index.ts
import { defineBootstrap, defineMount, defineUnmount } from '@vue-async/module-loader/sub';

export const bootstrap = defineBootstrap(app: App){
  // do something
})

export const mount = defineMount(app: App, props: Props){
  // do something

  // return some properties to register in main program
  return {
    routes: [],
  };
})

// only works in Vue3
export const unmount = defineUnmount(app:App, props: Props){
  // do something
})
```

<br>

### Declare the type of register properties

```ts
// Declare the type of register properties
declare module '@vue-async/module-loader' {
  interface RegisterProperties {
    routes?: RouteRecordRaw[];
  }
}
```
