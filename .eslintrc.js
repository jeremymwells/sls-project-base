module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    afterAll: 'readonly',
    afterEach: 'readonly',
    beforeAll: 'readonly',
    beforeEach: 'readonly',
    browser: 'readonly',
    describe: 'readonly',
    xdescribe: 'readonly',
    expect: 'readonly',
    it: 'readonly',
    xit: 'readonly',
    jasmine: 'readonly',
    SharedArrayBuffer: 'readonly',
    spyOn: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './'
  },
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  rules: {
    'padded-blocks': [ 'off' ],
    '@typescript-eslint/camelcase': 'off' || [ 'error', {
      ignoreDestructuring: true,
      properties: 'never',
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',  // Used for constructor DI
    '@typescript-eslint/no-unused-vars': [ 'error' ],
    'semi': 'off',
    '@typescript-eslint/semi': ['error'],
    'arrow-parens': [ 'error', 'as-needed' ],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'dot-notation': [ 'error', {
      allowPattern: '_toSvgElement',
    }],
    'import/order': [ 'error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
      ],
      'newlines-between': 'always',
    }],
    /**
     * This 'import/extensions' rules means, "Imports should never use a file extension,
     * and if they do it's an error level violation."
     * This is to allow imports from tsconfig path aliases to work without error
     */
    'import/extensions': ['error', 'never'],
    'import/no-extraneous-dependencies': [ 'error', {
      devDependencies: [ /* globs to ignore */  ],
    }],
    'import/prefer-default-export': 'off',  // Default exports break Angular's AoT (PRD) compiler
    'max-classes-per-file': 'off',
    'multiline-ternary': [ 'error', 'never' ],  // Require ternary expressions to be on one line
    'no-console': [ 'error', {
      'allow': [
        'error',  // Allow console.error only
      ],
    }],
    'no-empty-function': [ 'error', {
      'allow': [
        'constructors',  // Empty constructors used for Angular DI
      ],
    }],
    'no-plusplus': 'off',
    'no-return-assign': [ 'error', 'except-parens' ],
    'no-underscore-dangle': [ 'error', {
      allow: [
        '__dirame',
        '__env',
        '__filename',
      ],
    }],
    'no-useless-constructor': 'off',  // Angular uses constructors for Dependency Injection
    'object-curly-newline': [ 'error', {
      ImportDeclaration: {
        'consistent': true,
      },
    }],
    'space-in-parens': 'off',
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      "typescript": {
        "alwaysTryTypes": true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },

      "typescript": {
        "project": "."
      }
    }
  }
};
