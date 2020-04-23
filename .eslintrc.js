module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'prettier/vue',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    // ecmaFeatures: {
    //   "jsx": true
    // }
  },
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
    // allow console during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
    // defined on the @typescript-eslint/no-unused-vars
    'no-unused-vars': 0,
    // 语句强制分号结尾
    semi: 2,
    //空行最多不能超过2行
    'no-multiple-empty-lines': [0, { max: 2 }],
    //关闭禁止混用tab和空格
    'no-mixed-spaces-and-tabs': [0],
    //换行使用CRLF
    'linebreak-style': [2, 'windows'],
    //允许非default export
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'comma-dangle': [2, 'only-multiline'],
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'no-underscore-dangle': 0,
    'no-param-reassign': 0,
    'prefer-destructuring': 0,
    'max-len': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-this-alias': [2, { allowedNames: ['vm'] }],
    '@typescript-eslint/no-use-before-define': [2, { functions: false }],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        // 允许声明未使用变量
        vars: 'local',
        // 在使用的参数之前定义的不检测
        args: 'after-used',
        // 忽略以_开始的参数
        argsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', 'tsx', '.ts', 'tsx', '.vue'],
      },
    },
  },
  env: {
    node: true,
  },
};
