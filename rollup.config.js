import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: {
    main: 'demo/main.js',
    'app-main': 'demo/app-main.js'
  },
  output: {
    dir: 'demo/build',
    entryFileNames: '[name].js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve({
      browser: true
    })
  ]
};
