import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,  
      strict: false,
    },
  ],
  external: ['reflect-metadata'],
  plugins: [
    typescript({
      tsconfig: 'tsconfig.json',
      check: true,
      clean: true,
      verbosity: 1,
      objectHashIgnoreUnknownHack: true,
    }),
  ],
};
