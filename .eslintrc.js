module.exports = {
  root: true,
  env: {
    reactNative: true,
    node: true,
  },
  extends: [
    '@react-native',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'react',
    'react-hooks',
    'jest',
    'testing-library/react-native',
    'security',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true,
      },
      plugins: ['jest', 'testing-library/react-native'],
      extends: ['plugin:jest/recommended', 'plugin:testing-library/react-native/recommended'],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': ['error', {
      'quoteProps': 'consistent',
      'singleQuote': true,
      'tabWidth': 2,
      'trailingComma': 'es5',
      'useTabs': false,
    }],
  },
  ignorePatterns: [
    'node_modules/',
    'build/',
    'dist/',
    '*.config.js',
  ],
  reportUnusedDisableDirectives: true,
};