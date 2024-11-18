import { nodeResolve } from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default [
  {
    input: 'src/index.js',
    output: {
      dir: 'lib',
      format: 'cjs',
      strict: true,
      sourcemap: true,
      exports: 'auto'
    },
    external: ['react', 'codemirror', 'inkdrop'],
    plugins: [
      nodeResolve({ extensions: ['.js', '.jsx'] }),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react']
      })
    ]
  }
]
