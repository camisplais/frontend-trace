<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { roleLabel } from '@/types/roles'
import SidebarLink from './SidebarLink.vue'

const auth = useAuthStore()
const router = useRouter()

const iniciales = computed(() => {
  const nombre = auth.user?.nombre ?? ''
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase()
})

function cerrarSesion() {
  auth.logout()
  // Cuando exista la vista de login: router.push({ name: 'login' })
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__logo">TRACE</span>
    </div>

    <div v-if="auth.user" class="sidebar__user">
      <span class="sidebar__avatar">{{ iniciales }}</span>
      <span class="sidebar__user-info">
        <span class="sidebar__user-name">{{ auth.user.nombre }}</span>
        <span class="sidebar__user-role">{{ roleLabel[auth.user.role] }}</span>
      </span>
    </div>

    <nav class="sidebar__nav">
      <SidebarLink :to="{ name: 'cronograma' }" label="Cronograma">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </template>
      </SidebarLink>

      <SidebarLink :to="{ name: 'historial' }" label="Historial">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3v5h5" />
            <path d="M3.05 13A9 9 0 106 5.3L3 8" />
            <path d="M12 7v5l4 2" />
          </svg>
        </template>
      </SidebarLink>

      <SidebarLink :to="{ name: 'clientes' }" label="Clientes">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        </template>
      </SidebarLink>
    </nav>

    <button class="sidebar__logout" type="button" @click="cerrarSesion">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </svg>
      <span>Cerrar sesión</span>
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--color-sidebar-bg);
  display: flex;
  flex-direction: column;
  padding: var(--space-5) 0 var(--space-4);
}

.sidebar__brand {
  padding: 0 var(--space-5) var(--space-5);
}

.sidebar__logo {
  color: var(--color-primary);
  font-weight: var(--fw-bold);
  font-size: var(--fs-xl);
  letter-spacing: 0.05em;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-5) var(--space-6);
}

.sidebar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: #3a3a3a;
  color: var(--color-sidebar-text-strong);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
}

.sidebar__user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.sidebar__user-name {
  color: var(--color-sidebar-text-strong);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
}

.sidebar__user-role {
  color: var(--color-sidebar-text);
  font-size: var(--fs-xs);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin: 0 var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text);
  font-weight: var(--fw-medium);
  font-size: var(--fs-sm);
}

.sidebar__logout:hover {
  color: var(--color-sidebar-text-strong);
  background-color: rgba(255, 255, 255, 0.06);
}

.sidebar__logout svg {
  width: 20px;
  height: 20px;
}
</style>
