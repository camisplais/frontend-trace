<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="app-shell__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-shell__content {
  flex: 1;
  min-width: 0;
  padding: var(--space-6);
  overflow-y: auto;
}
</style>
