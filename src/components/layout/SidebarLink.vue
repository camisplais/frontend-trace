<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{
  to: { name: string }
  label: string
}>()
</script>

<template>
  <RouterLink :to="to" class="sidebar-link" active-class="sidebar-link--active">
    <span class="sidebar-link__icon">
      <slot name="icon" />
    </span>
    <span class="sidebar-link__label">{{ label }}</span>
  </RouterLink>
</template>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin: 0 var(--space-3);
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text);
  font-weight: var(--fw-medium);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover {
  color: var(--color-sidebar-text-strong);
  background-color: rgba(255, 255, 255, 0.06);
}

.sidebar-link--active {
  background-color: var(--color-sidebar-active-bg);
  color: var(--color-sidebar-active-text);
}

.sidebar-link--active:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-sidebar-active-text);
}

.sidebar-link__icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
}

.sidebar-link__label {
  font-size: var(--fs-sm);
}
</style>
