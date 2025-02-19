import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  external: ['react', 'inkdrop'],
  format: 'cjs',
  splitting: false,
  minify: true,
  sourcemap: true,
  clean: true,
  outExtension() {
    return { js: '.js' }
  },
  treeshake: true,
  noExternal: ['mermaid', 'svg-pan-zoom']
})
