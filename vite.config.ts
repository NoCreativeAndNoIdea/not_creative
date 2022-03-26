import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import { statSync, readdirSync, writeFileSync } from 'fs'

export interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
  isProduction?: boolean
}

const autoCreateExportFilePlugin = (options: Options): Plugin => {
  const __resolve = (url: string) => resolve(__dirname, url)
  const { include = '' } = options

  const template = (url: string): string => `export * from '${url}'\n`
  const targetPath = __resolve(include as string)

  const createTemplates = (targetPath: string) => {
    const isDir = statSync(targetPath).isDirectory()
    if (isDir) {
      let templates = ``
      const files = readdirSync(targetPath, 'utf8')
      files.forEach((fileName) => {
        const currentFilePath = `${targetPath}/${fileName}`
        const isDir = statSync(currentFilePath).isDirectory()
        if (isDir) {
          createTemplates(currentFilePath)
          templates += template(`./${fileName}`)
        } else if (fileName !== 'index.ts') {
          const name = fileName.split('.ts')[0]
          templates += template(`./${name}`)
        }
      })
      writeFileSync(`${targetPath}/index.ts`, templates)
    }
  }

  createTemplates(targetPath)

  return {
    name: 'auto-export',
    handleHotUpdate(ctx) {
      if (ctx.file.indexOf(targetPath) !== -1) {
        createTemplates(targetPath)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: true,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [
    vue(),
    vueJsx({}),
    autoCreateExportFilePlugin({
      include: './src/hooks',
    }),
  ],
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
