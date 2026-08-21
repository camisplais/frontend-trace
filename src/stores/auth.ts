import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Role, type CurrentUser, type UsuarioApi } from '@/types/roles'

/**
 * Convierte la respuesta cruda de /auth/me al shape que usan las vistas.
 */
function mapUsuarioApiToCurrentUser(data: UsuarioApi): CurrentUser | null {
  if (!data.rol) return null
  console.log('[DEBUG] rol crudo:', data.rol.nombre)
  console.log('[DEBUG] Role.CUSTOMER_SERVICE vale:', Role.CUSTOMER_SERVICE)
  console.log('[DEBUG] son iguales?:', data.rol.nombre === Role.CUSTOMER_SERVICE)

  return {
    id: data.id,
    nombre: data.empleado ? `${data.empleado.nombre} ${data.empleado.apellido_paterno}` : data.username,
    role: data.rol.nombre as Role,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  const cargando = ref(true)
  let cargaEnProgreso: Promise<void> | null = null

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role ?? null)

  async function cargarUsuario() {
    // Si ya hay una carga en curso, reutilízala en vez de disparar otra
    if (cargaEnProgreso) return cargaEnProgreso

    cargaEnProgreso = (async () => {
      cargando.value = true
      try {
        const res = await fetch(`${import.meta.env.VITE_API_NEGOCIO_URL}/auth/me`, {
          credentials: 'include',
        })

        if (!res.ok) {
          user.value = null
          return
        }

        const data = await res.json()
        user.value = mapUsuarioApiToCurrentUser(data)
      } catch (e) {
        console.error('Error al cargar usuario', e)
        user.value = null
      } finally {
        cargando.value = false
      }
    })()

    return cargaEnProgreso
  }

  function logout() {
    user.value = null
    cargaEnProgreso = null
  }

  return { user, isAuthenticated, role, cargando, cargarUsuario, logout }
})
