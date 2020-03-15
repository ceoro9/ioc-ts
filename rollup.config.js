import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
      strict: true,
    },
  ],
  external: ['reflect-metadata'],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      typescript: require('typescript'),
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ES2015',
        },
      },
      check: true,
      clean: true,
      verbosity: 1,
      objectHashIgnoreUnknownHack: true,
    }),
    terser(),
  ],
};
