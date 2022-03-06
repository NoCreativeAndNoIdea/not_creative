import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [vue()],
  resolve: {
    // 有两种写法
    /*
      // 写法一
      alias: {
        "~": "/src"
      }
    */
    // 写法二
    alias: [
      {
        find: '~',
        replacement: '/src',
      },
      {
        find: '~common',
        replacement: '/src/common',
      },
      {
        find: '~components',
        replacement: '/src/components',
      },
    ],
    extensions: ['.ts', '.vue', '.tsx'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "~/styles/index.scss"; `,
      },
    },
  },
})
