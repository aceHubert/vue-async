module.exports = {
  presets: [
    [
      '@nuxt/babel-preset-app',
      {
        // decoratorsBeforeExport: true,
        // loose: true,
        // decoratorsLegacy: true,
      },
    ],
    ['@babel/preset-env', { targets: { node: 'current' } }],
  ],
  plugins: [],
};
