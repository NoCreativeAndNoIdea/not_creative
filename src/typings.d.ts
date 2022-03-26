import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // site title
    title?: string
  }
}
