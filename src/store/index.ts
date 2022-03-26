import { App } from 'vue'
import { createPinia, acceptHMRUpdate } from 'pinia'

Object.values(import.meta.globEager('./*.ts')).forEach((module) => {
  if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(module.default, import.meta.hot))
  }
})

export default {
  install(app: App) {
    app.use(createPinia())
  },
}
