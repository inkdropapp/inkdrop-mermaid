import eslintJs from '@eslint/js'
import eslintReact from 'eslint-plugin-react'
import eslintPrettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslintJs.configs.recommended,
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat['jsx-runtime'],
  eslintPrettier,
  {
    files: ['lib/**/*.js', 'lib/**/*.jsx'],

    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.commonjs
      }
    },

    rules: {
      'no-useless-escape': 0,
      'prefer-const': 2,

      'no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],

      'react/prop-types': 0
    },

    settings: {
      react: {
        version: '18'
      }
    }
  }
]
