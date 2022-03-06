import { useAuthStore } from './../store/auth'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useLangStore } from '~/store/lang'
import { LANG_ENUM } from '~/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/zh`,
  },
  {
    path: '/:lang/',
    name: 'home',
    component: () => import('~/views/Home/Home.vue'),
  },
  {
    path: '/:lang/login',
    name: 'login',
    component: () => import('~/views/Login/Login.vue'),
  },
  // 404 component
  {
    path: '/:pathMatch(.*)',
    component: () => import('~/layouts/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // set current locale language
  const langStore = useLangStore()
  const authStore = useAuthStore()
  const lang = to.params.lang as string
  if (lang in LANG_ENUM) {
    langStore.setLanguage(LANG_ENUM[lang])
  }

  if (!import.meta.env.DEV) {
    if (!authStore.getIsLogin && to.name !== 'login') {
      return next({
        name: 'login',
        params: {
          lang: 'zh',
        },
      })
    }
  }

  return next()
})

export default router
