import path from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron-renderer';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: [ 
        { find: 'styles', replacement: path.resolve('./src/renderer/src/styles/*') },
        { find: 'assets', replacement: path.resolve('./src/renderer/src/assets/*') },
        { find: 'components', replacement: path.resolve('./src/renderer/src/components') },
        { find: 'contexts', replacement: path.resolve('./src/renderer/src/contexts/*') },
        { find: 'hooks', replacement: path.resolve('./src/renderer/src/hooks/*') },
        { find: 'layouts', replacement: path.resolve('./src/renderer/src/layouts/*') },
        { find: 'pages', replacement: path.resolve('./src/renderer/src/pages/*') },
        { find: 'routes', replacement: path.resolve('./src/renderer/src/routes/*') },
        { find: 'store', replacement: path.resolve('./src/renderer/src/store/*') },
        { find: 'utils', replacement: path.resolve('./src/renderer/src/utils/*') }
      ]
    },
    plugins: [react(),
      electron({
        include: ['electron','preload']
        /*  plugins: [
          loadViteEnv()
        ] */
      }),
      // renderer에서 node js 사용
      renderer({
        nodeIntegration: true
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
          `
          @use 'sass:math';
          @import "./src/renderer/src/styles/_variables";
          @import "./src/renderer/src/styles/_global";
          `
        }
      }
    }
  }
});
