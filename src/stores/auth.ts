import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Role, type CurrentUser, type UsuarioApi } from '@/types/roles'

const API_NEGOCIO_URL = import.meta.env.VITE_API_NEGOCIO_URL

/**
 * Convierte la respuesta cruda de /auth/me al shape que usan las vistas.
 */
function mapUsuarioApiToCurrentUser(data: UsuarioApi): CurrentUser | null {
  if (!data.rol) return null // usuario sin rol asignado no puede operar

  return {
    id: data.id,
    nombre: data.empleado
      ? `${data.empleado.nombre} ${data.empleado.apellido_paterno}`
      : data.username,
    role: data.rol.nombre as Role,
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>(null)
  const cargando = ref(true)

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role ?? null)

  function setUser(next: CurrentUser | null) {
    user.value = next
  }

  async function cargarUsuario() {
    cargando.value = true
    try {
      const res = await fetch(`${API_NEGOCIO_URL}/auth/me`, {
        credentials: 'include',
      })

      if (!res.ok) {
        user.value = null
        return
      }

      const data: UsuarioApi = await res.json()
      user.value = mapUsuarioApiToCurrentUser(data)
    } catch (e) {
      console.error('Error al cargar usuario', e)
      user.value = null
    } finally {
      cargando.value = false
    }
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, role, cargando, setUser, logout, cargarUsuario }
})