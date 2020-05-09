module.exports = {
  extends: [
    '@vue/typescript/recommended', // -> @typescript-eslint/eslint-recommended & @typescript-eslint/recommended
    '@vue/prettier/standard', // -> eslint-config-prettier/standard
    '@vue/prettier/@typescript-eslint', // -> eslint-config-prettier/@typescript-eslint
  ],
  rules: {
    // replaced by @vue/typescript/recommended -> @typescript-eslint/recommended
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
  overrides: [],
};
