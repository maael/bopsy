/* eslint-disable */

module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:import/typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
    project: 'tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'jsdoc', 'import', '@babel'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    /**
     * Require that member overloads be consecutive
     */
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    /**
     * Disallows awaiting a value that is not a Thenable
     */
    '@typescript-eslint/await-thenable': 'error',
    /**
     * Bans specific types from being used
     */
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Boolean: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
          Symbol: 'Avoid using the `Boolean` type. Did you mean `symbol`?',
          Number: 'Avoid using the `Number` type. Did you mean `number`?',
          String: 'Avoid using the `String` type. Did you mean `string`?',
          Object: 'Avoid using the `Object` type. Did you mean `object`?',
          Function: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
          /*
           * Allow use of '{}' - we use it to define React components with no properties
           */
          '{}': false,
        },
      },
    ],
    /**
     * Enforces consistent usage of type assertions
     */
    '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
    /**
     * Enforce dot notation whenever possible
     */
    '@typescript-eslint/dot-notation': 'error',
    /**
     * Disallow empty functions
     */
    '@typescript-eslint/no-empty-function': 'error',
    /**
     * Forbids the use of classes as namespaces
     */
    '@typescript-eslint/no-extraneous-class': 'error',
    /**
     * Requires Promise-like values to be handled appropriately
     */
    '@typescript-eslint/no-floating-promises': [0],
    /**
     * Disallow iterating over an array with a for-in loop
     */
    '@typescript-eslint/no-for-in-array': 'error',
    /**
     * Enforce valid definition of `new` and `constructor`
     */
    '@typescript-eslint/no-misused-new': 'error',
    /**
     * Disallow the use of parameter properties in class constructors
     */
    '@typescript-eslint/no-parameter-properties': 'error',
    /**
     * Disallow aliasing this
     */
    '@typescript-eslint/no-this-alias': 'error',
    /**
     * Warns if a type assertion does not change the type of an expression
     */
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    /**
     * Disallow unused expressions
     */
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
      },
    ],
    /**
     * Prefer a `for-of` loop over a standard `for` loop if the index is only used to access the array being iterated
     */
    '@typescript-eslint/prefer-for-of': 'error',
    /**
     * Use function types instead of interfaces with call signatures
     */
    '@typescript-eslint/prefer-function-type': 'error',
    /**
     * Require the use of the `namespace` keyword instead of the `module` keyword to declare custom TypeScript modules
     */
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    /**
     * Requires that private members are marked as `readonly` if they're never modified outside of the constructor
     */
    '@typescript-eslint/prefer-readonly': 'error',
    /**
     * Requires any function or method that returns a Promise to be marked async
     */
    '@typescript-eslint/promise-function-async': 'error',
    /**
     * When adding two variables, operands must both be of type number or of type string
     */
    '@typescript-eslint/restrict-plus-operands': 'error',
    /**
     * Sets preference level for triple slash directives versus ES6-style import declarations
     */
    '@typescript-eslint/triple-slash-reference': [
      'error',
      {
        path: 'always',
        types: 'prefer-import',
        lib: 'always',
      },
    ],
    /**
     * Enforces unbound methods are called with their expected scope
     */
    '@typescript-eslint/unbound-method': 'error',
    /**
     * Warns for any two overloads that could be unified into one by using a union or an optional/rest parameter
     */
    '@typescript-eslint/unified-signatures': 'error',
    /**
     * Prevents conditionals where the type is always truthy or always falsy
     */
    '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
    /**
     *
     */
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    /**
     * Ensures `super()` is called in derived class constructors
     */
    'constructor-super': 'error',
    /**
     * Require === and !==
     */
    eqeqeq: ['error', 'smart'],
    /**
     * Blacklist certain identifiers to prevent them being used
     * "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton
     */
    'id-blacklist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    /**
     * Require identifiers to match a specified regular expression
     */
    'id-match': 'error',
    /**
     * Report imported names marked with @deprecated documentation tag
     */
    'import/no-deprecated': 'error',
    /**
     * Forbid the use of extraneous packages
     */
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/scripts/**/*', '**/__tests__/**/*', '**/__story__/**/*', '**/fixtures/**/*'],
        optionalDependencies: false,
      },
    ],
    /**
     * Reports invalid alignment of JSDoc block asterisks.
     */
    'jsdoc/check-alignment': 'error',
    /**
     * Reports invalid padding inside JSDoc blocks.
     */
    'jsdoc/check-indentation': 'error',
    /**
     * Enforces a consistent padding of the block description.
     */
    'jsdoc/newline-after-description': 'error',
    /**
     * This rule reports types being used on @param or @returns.
     */
    'jsdoc/no-types': 'error',
    /**
     * The use of bitwise operators in JavaScript is very rare and often & or | is simply a mistyped && or ||, which will lead to unexpected behavior.
     */
    'no-bitwise': 'error',
    /**
     * Disallow assignment operators in conditional statements
     */
    'no-cond-assign': 'error',
    /**
     * Disallow console.log
     */
    'no-console': [
      'error',
      {
        allow: [
          'debug',
          'info',
          'dirxml',
          'warn',
          'error',
          'time',
          'timeEnd',
          'timeLog',
          'trace',
          'assert',
          'clear',
          'count',
          'countReset',
          'group',
          'groupCollapsed',
          'groupEnd',
          'table',
          'Console',
          'markTimeline',
          'profile',
          'profileEnd',
          'timeline',
          'timelineEnd',
          'timeStamp',
          'context',
        ],
      },
    ],
    /**
     * Disallow the use of debugger
     */
    'no-debugger': 'error',
    /**
     * Rule to disallow a duplicate case label
     */
    'no-duplicate-case': 'error',
    /**
     * Disallow duplicate imports
     */
    'no-duplicate-imports': 'error',
    /**
     * Disallow empty destructuring patterns
     */
    'no-empty': 'error',
    /**
     * Disallow eval()
     */
    'no-eval': 'error',
    /**
     * Disallow Case Statement Fallthrough
     */
    'no-fallthrough': 'error',
    /**
     * Disallow this keywords outside of classes or class-like objects.
     *
     * We use class fields in our class components, which is an ES proposal.
     * Eslint generates false positives for no-invalid-this in this case -
     * we need to use the babel plugin, which checks them correctly.
     */
    'no-invalid-this': 'off',
    '@babel/no-invalid-this': 'error',
    /**
     * Disallow Primitive Wrapper Instances
     */
    'no-new-wrappers': 'error',
    /**
     * Disallow variable redeclaration
     */
    'no-redeclare': 'error',
    /**
     * Disallow specific imports
     */
    'no-restricted-imports': [
      'error',
      'lodash',
      'date-fns',
      '@material-ui/core',
      '@material-ui/styles',
      '@material-ui/icons',
    ],
    /**
     * Disallow Use of the Comma Operator
     */
    'no-sequences': 'error',
    /**
     * Disallow Shadowing of Restricted Names
     */
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    /**
     * Disallow sparse arrays
     */
    'no-sparse-arrays': 'error',
    /**
     * Disallow template literal placeholder syntax in regular strings
     */
    'no-template-curly-in-string': 'error',
    /**
     * Disallow Initializing to undefined
     */
    'no-undef-init': 'error',
    /**
     * Disallow control flow statements in finally blocks
     */
    'no-unsafe-finally': 'error',
    /**
     * Require let or const instead of var
     */
    'no-var': 'error',
    /**
     * Disallow use of the void operator.
     */
    'no-void': 'error',
    /**
     * Enforce variables to be declared either separately in functions
     */
    'one-var': ['error', 'never'],
    /**
     * Suggest using of const declaration for variables that are never modified after declared
     */
    'prefer-const': 'error',
    /**
     * Require Radix Parameter
     */
    radix: 'error',
    /**
     * Require calls to isNaN() when checking for NaN
     */
    'use-isnan': 'error',

    // React-specific rule overrides

    /**
     * We use TypeScript - we don't use dynamic prop type checks
     */
    'react/prop-types': 'off',
    /**
     * We use anonymous functions for components - having displayNames would be good,
     * but we don't want to change the entire code base
     */
    'react/display-name': 'off',
    /**
     * Enable ' in unescaped entities - it's safe and escaping it makes adding copy harder
     */
    'react/no-unescaped-entities': [
      'error',
      {
        forbid: ['>', '}', '"'],
      },
    ],
    /**
     * Make exhaustive deps mandatory
     */
    'react-hooks/exhaustive-deps': 'error',
  },
  globals: {
    React: 'writable',
  },
}
