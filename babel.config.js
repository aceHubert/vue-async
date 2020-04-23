module.exports = api => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false, // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
          spec: true,
          forceAllTransforms: true,
          useBuiltIns: 'usage', // 根据使用导入
          // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
          // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
          corejs: {
            version: 3, // 使用core-js@3
            proposals: true,
          },
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'],
    babelrcRoots: ['.', 'packages/*'],
  };
};
