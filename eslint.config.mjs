import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import filenamesSimple from 'eslint-plugin-filenames-simple';
import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import importPlugin from 'eslint-plugin-import';
import jsxAllyPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import tsParser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default tseslint.config(
  {
    ignores: [
      'client/static/**/*',
      'client/.cache/**/*',
      'client/public/**/*',
      'api-server/**/*',
      'shared/**/*.js',
      'docs/**/*.md',
      '**/playwright*.config.ts',
      'playwright/**/*'
    ]
  },
  js.configs.recommended,
  reactPlugin.configs['flat'].recommended,
  jsxAllyPlugin.flatConfigs.recommended,
  ...fixupConfigRules(
    compat.extends(
      'plugin:react-hooks/recommended' // Note: at time of testing, upgrading to v5 creates false positives
    )
  ),
  importPlugin.flatConfigs.recommended,
  // TODO: consider adding eslint-plugin-n ():
  // ...nodePlugin.configs["flat/mixed-esm-and-cjs"],
  prettierConfig,
  {
    plugins: {
      'no-only-tests': noOnlyTests,
      'filenames-simple': fixupPluginRules(filenamesSimple)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.mocha,
        ...globals.node,
        ...globals.jest,
        Promise: true,
        window: true,
        $: true,
        ga: true,
        jQuery: true,
        router: true
      },

      parser: babelParser,

      parserOptions: {
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      }
    },

    settings: {
      react: {
        version: '16.4.2'
      },

      'import/resolver': {
        typescript: true,
        node: true
      }
    },

    // TODO: audit these rules and remove as many as possible, ideally we want
    // to rely on recommended configs.
    rules: {
      'import/no-unresolved': [
        2,
        {
          commonjs: true
        }
      ],

      'import/named': 'error',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/order': 'error',

      'import/no-cycle': [
        2,
        {
          maxDepth: 2
        }
      ],

      'react/prop-types': 'off',
      'react/jsx-no-useless-fragment': 'error',
      'no-only-tests/no-only-tests': 'error',
      'no-unused-vars': 'off',
      'no-unused-expressions': 'error', // This is so the js rules are more in line with the ts rules
      'filenames-simple/naming-convention': ['warn']
    }
  },
  {
    files: ['**/*.ts?(x)'],
    extends: [
      tseslint.configs.recommended,
      // TODO: turn on type-aware rules
      // tseslint.configs.recommendedTypeChecked,
      importPlugin.flatConfigs['typescript']
    ],

    languageOptions: {
      parser: tsParser,

      parserOptions: {
        projectService: true
      }
    },

    rules: {
      'import/no-unresolved': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: [
      'client/**/*.ts?(x)',
      'api/**/*.ts',
      'shared/**/*.ts',
      'tools/client-plugins/**/*.ts',
      'tools/scripts/**/*.ts',
      'tools/challenge-helper-scripts/**/*.ts',
      'tools/challenge-auditor/**/*.ts',
      'e2e/**/*.ts'
    ],
    extends: [tseslint.configs.recommendedTypeChecked]
  },
  {
    files: ['client/**/*.test.[jt]s?(x)'],

    extends: [
      testingLibraryPlugin.configs['flat/react'],
      jestDomPlugin.configs['flat/recommended']
    ]
  },
  {
    files: ['e2e/specs/*.ts'],

    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off'
    }
  },
  {
    files: ['.lintstagedrc.js', '**/.babelrc.js', '**/404.tsx'],
    rules: {
      'filenames-simple/naming-convention': 'off'
    }
  },
  {
    extends: [
      jsdoc.configs['flat/recommended-typescript-error'],
      tseslint.configs.recommendedTypeChecked
    ],
    files: ['**/api/src/**/*.ts'],

    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true
          },

          publicOnly: true
        }
      ],

      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/tag-lines': 'off'
    }
  }
);
