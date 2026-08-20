import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { Role } from '@/types/roles'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        redirect: () => {
          const authStore = useAuthStore()

          switch (authStore.role) {
            case Role.CUSTOMER_SERVICE:
              return { name: 'cronograma' }
            case Role.EMBARQUES:
            case Role.ADUANAS:
            case Role.COORD_STOCK:

            default:
              return { name: 'no-autorizado' }
          }
        },
      },
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
  {
    path: '/no-autorizado',
    name: 'no-autorizado',
    component: () => import('@/views/no_autorizado/NoAutorizado.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'no-autorizado' },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (authStore.cargando) {
    await authStore.cargarUsuario()
  }

  if (!authStore.isAuthenticated) {
    window.location.href = import.meta.env.VITE_SSO_LOGIN_URL
    return false
  }

  const rolesPermitidos = to.meta.roles as Role[] | undefined
  if (!rolesPermitidos) return true

  if (!authStore.role || !rolesPermitidos.includes(authStore.role)) {
    return { name: 'no-autorizado' }
  }

  return true
})

export default router