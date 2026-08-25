<script setup lang="ts">
import SolicitudesCoordinadorTable from '@/components/solicitudes/SolicitudesCSTable.vue'
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Solicitudes</h1>
    </header>

    <div class="card">
      <SolicitudesCoordinadorTable />
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
}
</style>
