import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

export const __useRouter = () => {
  const route = useRoute()
  const router = useRouter()

  const push = (to: RouteLocationRaw) => {
    try {
      router.push(to)
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error(e)
      }
      router.replace({
        name: '404',
      })
    }
  }

  return {
    route,
    router,
    push,
  }
}
