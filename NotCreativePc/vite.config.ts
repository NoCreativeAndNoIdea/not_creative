import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
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
})
