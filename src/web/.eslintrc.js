module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "root": true,
    "extends": [
        "plugin:react/recommended",
        "standard"
    ],

    "globals": {
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
        test: 'readonly',
        SharedArrayBuffer: 'readonly',
        spyOn: 'readonly',
    },

    "parser": "@typescript-eslint/parser",

    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },

    "plugins": [
        "react",
        "@typescript-eslint"
    ],

    "rules": {
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
        '@typescript-eslint/no-unused-vars': [ 'error', { argsIgnorePattern: "^_" } ],
        'semi': 'off',
        '@typescript-eslint/semi': ['error'],
        'arrow-parens': [ 'error', 'as-needed' ],
        'class-methods-use-this': 'off',
        'consistent-return': 'off',
        'dot-notation': [ 'error', { allowPattern: '_toSvgElement' }],
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
        'object-curly-newline': [ 'error', { ImportDeclaration: { 'consistent': true } }],
        'space-in-parens': 'off',
    },

    "settings": {
        "react": {
          "createClass": "createReactClass", // Regex for Component Factory to use,
                                             // default to "createReactClass"
          "pragma": "React",  // Pragma to use, default to "React"
          "fragment": "Fragment",  // Fragment to use (may be a property of <pragma>), default to "Fragment"
          "version": "detect", // React version. "detect" automatically picks the version you have installed.
                               // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                               // It will default to "latest" and warn if missing, and to "detect" in the future
          "flowVersion": "0.53" // Flow version
        },
        "propWrapperFunctions": [
            // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
            "forbidExtraProps",
            {"property": "freeze", "object": "Object"},
            {"property": "myFavoriteWrapper"},
            // for rules that check exact prop wrappers
            {"property": "forbidExtraProps", "exact": true}
        ],
        "componentWrapperFunctions": [
            // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
            // "observer", // `property`
            // {"property": "styled"}, // `object` is optional
            // {"property": "observer", "object": "Mobx"},
            // {"property": "observer", "object": "<pragma>"} // sets `object` to whatever value `settings.react.pragma` is set to
        ],
        "formComponents": [
          // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
        //   "CustomForm",
        //   {"name": "Form", "formAttribute": "endpoint"}
        ],
        "linkComponents": [
          // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
        //   "Hyperlink",
        //   {"name": "Link", "linkAttribute": "to"}
        ]
    }
}
