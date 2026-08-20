<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import type { TipoEmbarque } from '@/types/embarque'

/**
 * Barra de filtros del Historial. Usa v-model para cada campo y emite
 * `aplicar` cuando el usuario pulsa el botón. No hace llamadas: solo UI.
 */
defineProps<{
  busqueda: string
  tipo: TipoEmbarque | ''
  fechaDesde: string
  fechaHasta: string
}>()

const emit = defineEmits<{
  'update:busqueda': [value: string]
  'update:tipo': [value: TipoEmbarque | '']
  'update:fechaDesde': [value: string]
  'update:fechaHasta': [value: string]
  aplicar: []
}>()
</script>

<template>
  <div class="filtros">
    <div class="filtros__buscar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="filtros__icon">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        :value="busqueda"
        type="text"
        placeholder="Buscar por cliente o plan de embarque…"
        @input="emit('update:busqueda', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <label class="filtros__campo">
      <span class="filtros__label">TIPO</span>
      <select
        :value="tipo"
        @change="emit('update:tipo', ($event.target as HTMLSelectElement).value as TipoEmbarque | '')"
      >
        <option value="">Todos</option>
        <option value="regular">Regular</option>
        <option value="expeditado">Expeditado</option>
      </select>
    </label>

    <label class="filtros__campo">
      <span class="filtros__label">FECHA INICIO</span>
      <input
        :value="fechaDesde"
        type="date"
        @input="emit('update:fechaDesde', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="filtros__campo">
      <span class="filtros__label">FECHA FIN</span>
      <input
        :value="fechaHasta"
        type="date"
        @input="emit('update:fechaHasta', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <BaseButton variant="primary" @click="emit('aplicar')">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />
        </svg>
      </template>
      Aplicar
    </BaseButton>
  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  align-items: flex-end;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.filtros__buscar {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.filtros__buscar input {
  width: 100%;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-6);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.filtros__icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-faint);
}

.filtros__campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.filtros__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.filtros__campo select,
.filtros__campo input {
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.filtros__buscar input:focus,
.filtros__campo select:focus,
.filtros__campo input:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
