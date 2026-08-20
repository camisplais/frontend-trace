<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

function ir(page: number, total: number) {
  if (page >= 1 && page <= total) emit('change', page)
}
</script>

<template>
  <nav class="paginacion" aria-label="Paginación">
    <button
      class="paginacion__flecha"
      :disabled="page <= 1"
      aria-label="Anterior"
      @click="ir(page - 1, totalPages)"
    >
      ‹
    </button>
    <button
      v-for="p in totalPages"
      :key="p"
      class="paginacion__num"
      :class="{ 'paginacion__num--activo': p === page }"
      @click="ir(p, totalPages)"
    >
      {{ p }}
    </button>
    <button
      class="paginacion__flecha"
      :disabled="page >= totalPages"
      aria-label="Siguiente"
      @click="ir(page + 1, totalPages)"
    >
      ›
    </button>
  </nav>
</template>

<style scoped>
.paginacion {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.paginacion__num,
.paginacion__flecha {
  min-width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: var(--radius-full);
  color: var(--color-text);
  font-size: var(--fs-sm);
}

.paginacion__num:hover:not(.paginacion__num--activo),
.paginacion__flecha:hover:not(:disabled) {
  background-color: var(--color-bg);
}

.paginacion__num--activo {
  background-color: var(--color-primary);
  color: #fff;
  font-weight: var(--fw-semibold);
}

.paginacion__flecha:disabled {
  color: var(--color-text-faint);
  cursor: not-allowed;
}
</style>
