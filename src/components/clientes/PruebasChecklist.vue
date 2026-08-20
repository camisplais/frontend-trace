<script setup lang="ts">
import type { Documento } from '@/types/cliente'

/**
 * Muestra el catálogo de pruebas de entrega con un check por cada una.
 * Es de solo lectura: refleja qué pruebas se guardarán según el tipo elegido
 * (los ids en `seleccionadas`). El usuario no las edita.
 */
defineProps<{
  documentos: Documento[]
  seleccionadas: Set<number>
}>()
</script>

<template>
  <div class="checklist">
    <p class="checklist__title">Pruebas de entrega necesarias</p>
    <ul class="checklist__list">
      <li v-for="doc in documentos" :key="doc.id" class="checklist__item">
        <span
          class="checkbox"
          :class="{ 'checkbox--on': seleccionadas.has(doc.id) }"
          aria-hidden="true"
        >
          <svg v-if="seleccionadas.has(doc.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span class="checklist__label">{{ doc.nombre }}</span>
      </li>
    </ul>
    <p v-if="documentos.length === 0" class="checklist__empty">
      No hay catálogo de pruebas disponible.
    </p>
  </div>
</template>

<style scoped>
.checklist__title {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.checklist__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.checklist__item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border-strong);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.checkbox--on {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox svg {
  width: 12px;
  height: 12px;
}

.checklist__label {
  font-size: var(--fs-sm);
  color: var(--color-text);
}

.checklist__empty {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}
</style>
