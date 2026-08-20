import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { Role } from '@/types/roles'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: { name: 'cronograma' } },
      {
        path: 'cronograma',
        name: 'cronograma',
        component: () => import('@/views/cronograma/CronogramaView.vue'),
        meta: { title: 'Cronograma', roles: [Role.CUSTOMER_SERVICE] },
      },
      {
        path: 'historial',
        name: 'historial',
        component: () => import('@/views/historial/HistorialView.vue'),
        meta: { title: 'Historial', roles: [Role.CUSTOMER_SERVICE] },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
