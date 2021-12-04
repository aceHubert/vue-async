# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.1.1](https://github.com/aceHubert/vue-async/compare/@vue-async/module-loader@3.1.0...@vue-async/module-loader@3.1.1) (2021-12-04)


### Bug Fixes

* entries 后 sort key 是字符串比较错误 ([1b97a05](https://github.com/aceHubert/vue-async/commit/1b97a05db55648e043c1206ab2e987d1447a3052))





# [3.1.0](https://github.com/aceHubert/vue-async/compare/@vue-async/module-loader@3.0.0...@vue-async/module-loader@3.1.0) (2021-10-24)


### Features

* 添加hooks功能 ([c85d883](https://github.com/aceHubert/vue-async/commit/c85d883dbc077c8e0f1378e50a90f0a8043c0029))
* **module-loader:** 添加模块加载的生命周期 ([4f0e2cc](https://github.com/aceHubert/vue-async/commit/4f0e2cc23e2f9a8e4c4e7627f222589f17136860))





# 3.0.0 (2021-07-22)


### Performance Improvements

* **module-loader:** 移除ssr加载功能 ([9f30a1f](https://github.com/aceHubert/vue-async/commit/9f30a1f60d6f2d2c24b502407efae9151eb61a4b))


### BREAKING CHANGES

* **module-loader:** 不可以server端使用



# 2.0.0 (2021-03-08)


### Features

* 移除dymanicComponent功能模块 ([eb046f5](https://github.com/aceHubert/vue-async/commit/eb046f587a7abcd1f2cd9940c9524dd3cde8db85))
* **module-loader:** 服务端渲染 ([06c30b8](https://github.com/aceHubert/vue-async/commit/06c30b8403776c16cf5d21f7dc9a2c22e13eb34d))


### Performance Improvements

* ts baseUrl 修改 ([c1722fa](https://github.com/aceHubert/vue-async/commit/c1722fa33d902ca680cfa04544f606948b5f9373))


### BREAKING CHANGES

* dymanicComponent功能将不可用



## 1.0.8 (2020-09-30)


### Features

* **module-loader:** 模块在 Vue 实例化之前调用方法 ([fb57208](https://github.com/aceHubert/vue-async/commit/fb57208020cb0da3dff68861c531adc59e767868))



## 1.0.7 (2020-09-14)


### Features

* **module-loader:** add "sync" param in options ([c7fae50](https://github.com/aceHubert/vue-async/commit/c7fae5084a711e3df33075aed464a832f4ea84b3))



## 1.0.6 (2020-09-01)


### Features

* moduleLoader error handle ([19741c3](https://github.com/aceHubert/vue-async/commit/19741c3847384b050de609cc9daef98c068c14ab))



## 1.0.5 (2020-08-07)


### Features

* extract css file load ([1bd5866](https://github.com/aceHubert/vue-async/commit/1bd5866d6e8ad47438c78b4346e6d13e46bb88a6))


### Performance Improvements

* rename dist filename ([468af87](https://github.com/aceHubert/vue-async/commit/468af875d596d11942e1c65af582f218b99ace38))



## 1.0.4 (2020-08-05)


### Features

* vue object using in modules problem ([c807d04](https://github.com/aceHubert/vue-async/commit/c807d04ea5b381980044ded1129f8e945b198a64))



## 1.0.3 (2020-07-13)


### Bug Fixes

* **module-loader:** router.beforeEach in beforeCreate ([af48850](https://github.com/aceHubert/vue-async/commit/af4885065612ff57dfb1dda506c73ae25e48d8e0))


### Features

* **module-loader:** module-loader install options change ([697841c](https://github.com/aceHubert/vue-async/commit/697841c0a60e638b111355b13c8e1cc4c3b6e80a))


### Performance Improvements

* **rollup:** rollup build packages ([791121a](https://github.com/aceHubert/vue-async/commit/791121a1b1cb3bbc19f03f0d6d79872f30148e83))



## 1.0.1 (2020-05-29)


### Bug Fixes

* changelog test ([93171fe](https://github.com/aceHubert/vue-async/commit/93171fe9dcae0f5286793b6fff9d8b159ac84f8e))
* window.Vue.use() options problem ([285b9c1](https://github.com/aceHubert/vue-async/commit/285b9c19990916b67568c57c7ca86f720a93a784))


### Features

* add remote component loader function ([ff5c47c](https://github.com/aceHubert/vue-async/commit/ff5c47c1e0ec1a0bc986cac244b5854b0b8cb104))
* addRoutes/AddLayouts 支持外部重新定义 ([d1a9ccb](https://github.com/aceHubert/vue-async/commit/d1a9ccb908db7af66c94c47c298254d03befa327))
* remove init modules from framework constructor ([b972b66](https://github.com/aceHubert/vue-async/commit/b972b6660acfa2d61f83fadb7bf1a2f0ab25f687))


### Performance Improvements

* code clean up ([9796b85](https://github.com/aceHubert/vue-async/commit/9796b85a6e6f7d19e05322e66c63314630704074))
* types format ([538cb85](https://github.com/aceHubert/vue-async/commit/538cb8538c25566b3cd976c00cf55db06b33eecf))





# 2.0.0 (2021-03-08)


### Features

* 移除dymanicComponent功能模块 ([eb046f5](https://github.com/aceHubert/vue-async/commit/eb046f587a7abcd1f2cd9940c9524dd3cde8db85))
* **module-loader:** 服务端渲染 ([06c30b8](https://github.com/aceHubert/vue-async/commit/06c30b8403776c16cf5d21f7dc9a2c22e13eb34d))


### Performance Improvements

* ts baseUrl 修改 ([c1722fa](https://github.com/aceHubert/vue-async/commit/c1722fa33d902ca680cfa04544f606948b5f9373))


### BREAKING CHANGES

* dymanicComponent功能将不可用



## 1.0.8 (2020-09-30)


### Features

* **module-loader:** 模块在 Vue 实例化之前调用方法 ([fb57208](https://github.com/aceHubert/vue-async/commit/fb57208020cb0da3dff68861c531adc59e767868))



## 1.0.7 (2020-09-14)


### Features

* **module-loader:** add "sync" param in options ([c7fae50](https://github.com/aceHubert/vue-async/commit/c7fae5084a711e3df33075aed464a832f4ea84b3))



## 1.0.6 (2020-09-01)


### Features

* moduleLoader error handle ([19741c3](https://github.com/aceHubert/vue-async/commit/19741c3847384b050de609cc9daef98c068c14ab))



## 1.0.5 (2020-08-07)


### Features

* extract css file load ([1bd5866](https://github.com/aceHubert/vue-async/commit/1bd5866d6e8ad47438c78b4346e6d13e46bb88a6))


### Performance Improvements

* rename dist filename ([468af87](https://github.com/aceHubert/vue-async/commit/468af875d596d11942e1c65af582f218b99ace38))



## 1.0.4 (2020-08-05)


### Features

* vue object using in modules problem ([c807d04](https://github.com/aceHubert/vue-async/commit/c807d04ea5b381980044ded1129f8e945b198a64))



## 1.0.3 (2020-07-13)


### Bug Fixes

* **module-loader:** router.beforeEach in beforeCreate ([af48850](https://github.com/aceHubert/vue-async/commit/af4885065612ff57dfb1dda506c73ae25e48d8e0))


### Features

* **module-loader:** module-loader install options change ([697841c](https://github.com/aceHubert/vue-async/commit/697841c0a60e638b111355b13c8e1cc4c3b6e80a))


### Performance Improvements

* **rollup:** rollup build packages ([791121a](https://github.com/aceHubert/vue-async/commit/791121a1b1cb3bbc19f03f0d6d79872f30148e83))



## 1.0.1 (2020-05-29)


### Bug Fixes

* changelog test ([93171fe](https://github.com/aceHubert/vue-async/commit/93171fe9dcae0f5286793b6fff9d8b159ac84f8e))
* window.Vue.use() options problem ([285b9c1](https://github.com/aceHubert/vue-async/commit/285b9c19990916b67568c57c7ca86f720a93a784))


### Features

* add remote component loader function ([ff5c47c](https://github.com/aceHubert/vue-async/commit/ff5c47c1e0ec1a0bc986cac244b5854b0b8cb104))
* addRoutes/AddLayouts 支持外部重新定义 ([d1a9ccb](https://github.com/aceHubert/vue-async/commit/d1a9ccb908db7af66c94c47c298254d03befa327))
* remove init modules from framework constructor ([b972b66](https://github.com/aceHubert/vue-async/commit/b972b6660acfa2d61f83fadb7bf1a2f0ab25f687))


### Performance Improvements

* code clean up ([9796b85](https://github.com/aceHubert/vue-async/commit/9796b85a6e6f7d19e05322e66c63314630704074))
* types format ([538cb85](https://github.com/aceHubert/vue-async/commit/538cb8538c25566b3cd976c00cf55db06b33eecf))





# 1.1.0 (2020-12-15)


### Features

* **module-loader:** 服务端渲染 ([06c30b8](https://github.com/aceHubert/vue-async/commit/06c30b8403776c16cf5d21f7dc9a2c22e13eb34d))


### Performance Improvements

* ts baseUrl 修改 ([c1722fa](https://github.com/aceHubert/vue-async/commit/c1722fa33d902ca680cfa04544f606948b5f9373))



## 1.0.8 (2020-09-30)


### Features

* **module-loader:** 模块在 Vue 实例化之前调用方法 ([fb57208](https://github.com/aceHubert/vue-async/commit/fb57208020cb0da3dff68861c531adc59e767868))



## 1.0.7 (2020-09-14)


### Features

* **module-loader:** add "sync" param in options ([c7fae50](https://github.com/aceHubert/vue-async/commit/c7fae5084a711e3df33075aed464a832f4ea84b3))



## 1.0.6 (2020-09-01)


### Features

* moduleLoader error handle ([19741c3](https://github.com/aceHubert/vue-async/commit/19741c3847384b050de609cc9daef98c068c14ab))



## 1.0.5 (2020-08-07)


### Features

* extract css file load ([1bd5866](https://github.com/aceHubert/vue-async/commit/1bd5866d6e8ad47438c78b4346e6d13e46bb88a6))


### Performance Improvements

* rename dist filename ([468af87](https://github.com/aceHubert/vue-async/commit/468af875d596d11942e1c65af582f218b99ace38))



## 1.0.4 (2020-08-05)


### Features

* vue object using in modules problem ([c807d04](https://github.com/aceHubert/vue-async/commit/c807d04ea5b381980044ded1129f8e945b198a64))



## 1.0.3 (2020-07-13)


### Bug Fixes

* **module-loader:** router.beforeEach in beforeCreate ([af48850](https://github.com/aceHubert/vue-async/commit/af4885065612ff57dfb1dda506c73ae25e48d8e0))


### Features

* **module-loader:** module-loader install options change ([697841c](https://github.com/aceHubert/vue-async/commit/697841c0a60e638b111355b13c8e1cc4c3b6e80a))


### Performance Improvements

* **rollup:** rollup build packages ([791121a](https://github.com/aceHubert/vue-async/commit/791121a1b1cb3bbc19f03f0d6d79872f30148e83))



## 1.0.1 (2020-05-29)


### Bug Fixes

* changelog test ([93171fe](https://github.com/aceHubert/vue-async/commit/93171fe9dcae0f5286793b6fff9d8b159ac84f8e))
* window.Vue.use() options problem ([285b9c1](https://github.com/aceHubert/vue-async/commit/285b9c19990916b67568c57c7ca86f720a93a784))


### Features

* add remote component loader function ([ff5c47c](https://github.com/aceHubert/vue-async/commit/ff5c47c1e0ec1a0bc986cac244b5854b0b8cb104))
* addRoutes/AddLayouts 支持外部重新定义 ([d1a9ccb](https://github.com/aceHubert/vue-async/commit/d1a9ccb908db7af66c94c47c298254d03befa327))
* remove init modules from framework constructor ([b972b66](https://github.com/aceHubert/vue-async/commit/b972b6660acfa2d61f83fadb7bf1a2f0ab25f687))


### Performance Improvements

* code clean up ([9796b85](https://github.com/aceHubert/vue-async/commit/9796b85a6e6f7d19e05322e66c63314630704074))
* types format ([538cb85](https://github.com/aceHubert/vue-async/commit/538cb8538c25566b3cd976c00cf55db06b33eecf))
