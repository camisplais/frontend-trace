import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Role, type CurrentUser } from '@/types/roles'

/**
 * Store de autenticacion.
 * De momento arranca con un usuario "mock" de Customer Service para poder
 * construir las pantallas. Cuando exista el login real, `login()` debe
 * reemplazar este usuario con la respuesta del backend.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<CurrentUser | null>({
    id: 1,
    nombre: 'Marina Rojas',
    role: Role.CUSTOMER_SERVICE,
  })

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role ?? null)

  function setUser(next: CurrentUser | null) {
    user.value = next
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, role, setUser, logout }
})
