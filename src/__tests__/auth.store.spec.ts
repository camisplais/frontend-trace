import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types/roles'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('arranca con un usuario de Customer Service', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.role).toBe(Role.CUSTOMER_SERVICE)
  })

  it('logout limpia el usuario', () => {
    const auth = useAuthStore()
    auth.logout()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
  })
})
