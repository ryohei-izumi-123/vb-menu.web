module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['babel', 'prettier'],
  globals: {
    chrome: true,
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true
      }
    ],
    "no-console": "off",
    'no-var': 1,
    'prefer-arrow-callback': 2,
    'no-undef': 0,
    'space-before-function-paren': 0,
    // 'space-before-function-paren': ['error', 'never'],
    'prefer-promise-reject-errors': 0,
    'no-throw-literal': 0,
    quotes: ['error', 'single'],
    // semi: ['error'],
    // 'no-return-await': 0
  }
};
