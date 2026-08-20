<script setup lang="ts">
import TipoBadge from '@/components/ui/TipoBadge.vue'
import PlanChip from '@/components/ui/PlanChip.vue'
import type { CronogramaFila, Cliente } from '@/types/embarque'

/**
 * Tabla del cronograma. Muestra las filas parseadas y permite asignar el
 * cliente de cada una (v-model sobre `clienteId` de cada fila). Las filas con
 * errores de parseo se muestran resaltadas.
 */
defineProps<{
  filas: CronogramaFila[]
  clientes: Cliente[]
  csNombre: string
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>CS</th>
        <th>Cliente</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>ID Plan de embarque</th>
        <th>Tarimas</th>
        <th>Piezas</th>
        <th>Tipo</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="f in filas" :key="f.fila" :class="{ 'row--error': f.datos === null }">
        <template v-if="f.datos">
          <td>{{ csNombre }}</td>
          <td>
            <select v-model="f.clienteId" class="cliente-select">
              <option :value="null" disabled>Selecciona…</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </td>
          <td>{{ f.datos.fecha }}</td>
          <td>{{ f.datos.hora }}</td>
          <td><PlanChip :label="f.datos.plan_embarque" /></td>
          <td>{{ f.datos.tarima }}</td>
          <td>{{ f.datos.cantidad_piezas }}</td>
          <td><TipoBadge :tipo="f.datos.tipo" /></td>
        </template>
        <template v-else>
          <td>{{ csNombre }}</td>
          <td colspan="7" class="row-error-msg">
            Fila {{ f.fila }}: {{ f.errores.join(' · ') }}
          </td>
        </template>
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

.row--error td {
  background-color: #fdf5f5;
}

.row-error-msg {
  color: var(--color-danger);
  font-size: var(--fs-xs);
}

.cliente-select {
  width: 100%;
  max-width: 200px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
}

.cliente-select:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
