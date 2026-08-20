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
      {
        path: 'clientes',
        name: 'clientes',
        component: () => import('@/views/clientes/ClientesView.vue'),
        meta: { title: 'Clientes', roles: [Role.CUSTOMER_SERVICE] },
      },
      {
        path: 'clientes/registrar',
        name: 'clientes-registrar',
        component: () => import('@/views/clientes/RegistrarClienteView.vue'),
        meta: { title: 'Registrar Cliente', roles: [Role.CUSTOMER_SERVICE] },
      },
      {
        path: 'horario',
        name: 'horario',
        component: () => import('@/views/horario/HorarioView.vue'),
        meta: { title: 'Horario', roles: [Role.EMBARQUES] },
      },
      {
        path: 'viajes',
        name: 'viajes',
        component: () => import('@/views/viajes/ViajesView.vue'),
        meta: { title: 'Viajes', roles: [Role.EMBARQUES] },
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
