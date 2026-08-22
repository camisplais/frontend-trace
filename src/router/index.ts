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
              return { name: 'horario' }
            case Role.ADUANAS:
              return { name: 'viajes-realizados' }
            case Role.COORD_STOCK:
              return { name: 'transportes' }

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
        path: 'transportes',
        name: 'transportes',
        component: () => import('@/views/transportes/TransportesView.vue'),
        meta: { title: 'Transportes', roles: [Role.COORD_STOCK] },
      },
      {
        path: 'viajes-realizados',
        name: 'viajes-realizados',
        component: () => import('@/views/viajesRealizados/ViajesRealizadosView.vue'),
        meta: { title: 'Viajes Realizados', roles: [Role.COORD_STOCK, Role.ADUANAS] },
      },
      {
        path: 'transportes/registrar',
        name: 'transportes-registrar',
        component: () => import('@/views/transportes/RegistrarTransporteView.vue'),
        meta: { title: 'Registrar Transporte', roles: [Role.COORD_STOCK] },
      },
      {
        path: 'empleados',
        name: 'empleados',
        component: () => import('@/views/empleados/EmpleadosView.vue'),
        meta: { title: 'Empleados', roles: [Role.COORD_STOCK] },
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
      {
        path: 'viajes/crear',
        name: 'crear-viaje',
        component: () => import('@/views/viajes/CrearViajeView.vue'),
        meta: { title: 'Crear viaje', roles: [Role.EMBARQUES] },
      },
      {
        path: 'viajes/:id',
        name: 'viaje-detalle',
        component: () => import('@/views/viajes/ViajeDetalleView.vue'),
        meta: { title: 'Detalle del viaje', roles: [Role.EMBARQUES] },
      },
      {
        path: 'viajes/:id/embarques',
        name: 'agregar-embarque',
        component: () => import('@/views/viajes/AgregarEmbarqueView.vue'),
        meta: { title: 'Agregar embarque', roles: [Role.EMBARQUES] },
      },
      {
        path: 'pendientes',
        name: 'pendientes',
        component: () => import('@/views/horario/HorarioView.vue'), // temporal, solo para no romper el link
        meta: { title: 'Pendientes', roles: [Role.EMBARQUES] },
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
