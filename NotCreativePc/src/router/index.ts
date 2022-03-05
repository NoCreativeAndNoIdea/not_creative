import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

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

export default router
