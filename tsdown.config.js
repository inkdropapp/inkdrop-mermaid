import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: ['cjs'],
  minify: true,
  sourcemap: true,
  clean: true,
  outExtensions: () => ({ js: '.js' }),
  treeshake: true,
  deps: {
    neverBundle: ['react', 'react/jsx-runtime', 'inkdrop'],
    alwaysBundle: ['mermaid', 'panzoom']
  },
  outputOptions: {
    codeSplitting: {
      groups: [
        {
          name: 'env',
          test: /[\\/]src[\\/]env\./,
          priority: 20
        },
        {
          name: 'mermaid',
          test: /node_modules|[\\/]src[\\/](mermaid|utils|use-panzoom|mermaid-toolbar|icons|useDarkMode|theme)\./,
          priority: 10
        }
      ]
    }
  }
})
