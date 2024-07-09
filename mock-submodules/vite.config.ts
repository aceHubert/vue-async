import { fileURLToPath, URL } from 'node:url';
import { defineConfig, LibraryOptions } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const fileName: LibraryOptions['fileName'] = (format) => {
  switch (format) {
    case 'cjs':
    case 'commonjs':
      return `index.cjs.js`;
    case 'es':
    case 'esm':
    case 'module':
      return `index.es.js`;
    case 'iife':
      return `index.js`;
    default:
      return `index.${format}.js`;
  }
};

const libs: Record<string, LibraryOptions> = {
  componentA: {
    entry: 'src/componentA/index.tsx',
    name: 'componentA',
    fileName,
  },
  componentB: {
    entry: 'src/componentB.vue',
    name: 'componentB',
    fileName,
  },
  dymanicRouter: {
    entry: 'src/dymanicRouter/index.ts',
    name: 'dynamicRouter',
    fileName,
  },
  sortTest: {
    entry: 'src/sortTest/index.ts',
    name: 'sortTest',
    fileName,
  },
};

const libName = process.env.LIB_NAME || 'dymanicRouter';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: `dist/${libName}`,
    emptyOutDir: false,
    minify: false,
    lib: {
      ...libs[libName],
      formats: ['cjs', 'umd', 'es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@vue-async/module-loader/esm/sub': fileURLToPath(new URL('../packages/module-loader/src/sub', import.meta.url)),
    },
  },
  plugins: [vue(), vueJsx()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
