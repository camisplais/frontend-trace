<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import {
  estadosTransporte,
  estadoTransporteLabel,
  type EstadoTransporte,
} from '@/types/transporte'

defineProps<{
  estado: EstadoTransporte | ''
}>()

const emit = defineEmits<{
  'update:estado': [value: EstadoTransporte | '']
  aplicar: []
  cancelar: []
}>()
</script>

<template>
  <div class="filtros">
    <label class="filtros__campo">
      <span class="filtros__label">FILTRAR POR</span>
      <select
        :value="estado"
        @change="emit('update:estado', ($event.target as HTMLSelectElement).value as EstadoTransporte | '')"
      >
        <option value="">Estado de unidad</option>
        <option v-for="e in estadosTransporte" :key="e" :value="e">
          {{ estadoTransporteLabel[e] }}
        </option>
      </select>
    </label>

    <div class="filtros__acciones">
      <BaseButton variant="primary" @click="emit('aplicar')">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />
          </svg>
        </template>
        Aplicar
      </BaseButton>

      <BaseButton variant="secondary" @click="emit('cancelar')">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </template>
        Cancelar
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  align-items: flex-end;
  gap: var(--space-4);
  flex-wrap: wrap;
  margin-bottom: var(--space-5);
}

.filtros__campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 220px;
}

.filtros__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.filtros__campo select {
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
}

.filtros__campo select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.filtros__acciones {
  display: flex;
  gap: var(--space-3);
}
</style>
