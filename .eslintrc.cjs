const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:vitest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'vitest'],
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'never',
        'd.ts': 'never',
      },
    ],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'prettier/prettier': 0,
    'react/function-component-definition': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 0,
    'react/react-in-jsx-scope': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json', '.d.ts'],
      },
    },
  },
  overrides: [
    {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: path.join(__dirname, 'cypress'),
      },
      files: ['cypress/**/*.ts', 'cypress/**/*.js'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        'vitest/expect-expect': 0,
      }
    },
  ],
}
