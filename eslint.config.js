import eslintJs from '@eslint/js'
import eslintTs from 'typescript-eslint'
import eslintReact from 'eslint-plugin-react'
import eslintPrettier from 'eslint-plugin-prettier/recommended'

export default eslintTs.config(
  eslintJs.configs.recommended,
  eslintTs.configs.recommended,
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat['jsx-runtime'],
  eslintPrettier,
  {
    ignores: ['**/node_modules/*', '/lib/**/*.js'],
    settings: { react: { version: '18' } }
  }
)
