import { useTitle } from '~/hooks/useTitle'
import { useAuthStore } from '~/store/auth'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useLangStore } from '~/store/lang'
import { LANG_ENUM } from '~/i18n'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: `/zh/home`,
  },
  {
    path: '/:lang?',
    component: () => import('~/views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: 'home',
        },
        component: () => import('~/views/Home/Home.vue'),
      },
      {
        path: 'find',
        name: 'find',
        meta: {
          title: 'find'
        },
        component: () => import('~/views/Find/index.vue')
      },
      // 404 component
      {
        path: ':pathMatch(.*)*',
        name: '404',
        component: () => import('~/layouts/NotFound.vue'),
      },
    ],
  },
  {
    path: '/:lang?/login',
    name: 'login',
    meta: {
      title: 'login',
    },
    component: () => import('~/views/Login/Login.vue'),
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
  } else {
    to.params.lang = langStore.getLang
  }
  const title = to.meta?.title
  useTitle(title ?? '')

  if (!authStore.getIsLogin && to.name !== 'login') {
    return next({
      name: 'login',
      params: {
        lang: 'zh',
      },
    })
  }

  if (authStore.getIsLogin && to.name === 'login') {
    return next({
      name: 'home',
      params: {
        lang: 'zh',
      },
    })
  }

  return next()
})

export default router
