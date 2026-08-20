<script setup lang="ts">
import TipoBadge from '@/components/ui/TipoBadge.vue'
import PlanChip from '@/components/ui/PlanChip.vue'
import type { Embarque } from '@/types/embarque'

/**
 * Tabla de embarques del Historial. Solo presenta datos y emite `ver`
 * cuando se pulsa el ojo de una fila. El índice inicial permite numerar
 * correctamente según la página.
 */
defineProps<{
  embarques: Embarque[]
  indiceInicial: number
  cargando?: boolean
}>()

const emit = defineEmits<{ ver: [embarque: Embarque] }>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Cliente</th>
        <th>Plan embarque</th>
        <th>Tarimas</th>
        <th>Pzas</th>
        <th>Tipo</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(e, i) in embarques" :key="e.id">
        <td>{{ indiceInicial + i }}</td>
        <td>{{ e.cliente.nombre }}</td>
        <td><PlanChip :label="e.plan_embarque" /></td>
        <td>{{ e.tarima }}</td>
        <td>{{ e.cantidad_piezas.toLocaleString() }}</td>
        <td><TipoBadge :tipo="e.tipo" /></td>
        <td>
          <button class="ojo" aria-label="Ver seguimiento" @click="emit('ver', e)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </td>
      </tr>
      <tr v-if="!cargando && embarques.length === 0">
        <td colspan="7" class="table__empty">No hay embarques para mostrar.</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table__empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-6);
}

.ojo {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
}

.ojo:hover {
  color: var(--color-primary);
  background-color: var(--color-bg);
}

.ojo svg {
  width: 18px;
  height: 18px;
  display: block;
}
</style>
