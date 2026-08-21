<script setup lang="ts">
import TipoBadge from '@/components/ui/TipoBadge.vue'
import PlanChip from '@/components/ui/PlanChip.vue'
import type { Embarque } from '@/types/embarque'
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps<{
  embarques: Embarque[]
  cargando?: boolean
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>CS</th>
        <th>Cliente</th>
        <th>Fecha</th>
        <th>Hora</th>
        <th>Embarque</th>
        <th>Tarimas</th>
        <th>Piezas</th>
        <th>Tipo</th>
        <th>En viaje</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="e in embarques" :key="e.id">
        <td>{{ e.id }}</td>
        <td>{{ e.empleado?.nombre ?? '—' }}</td>
        <td>{{ e.cliente.nombre }}</td>
        <td>{{ e.fecha }}</td>
        <td>{{ e.hora }}</td>
        <td><PlanChip :label="e.plan_embarque" /></td>
        <td>{{ e.tarima }}</td>
        <td>{{ e.cantidad_piezas }}</td>
        <td><TipoBadge :tipo="e.tipo" /></td>
        <td>
          <button
            v-if="e.viaje_id"
            class="estado-viaje estado-viaje--link"
            @click="router.push({ name: 'viaje-detalle', params: { id: e.viaje_id } })"
          >
            <span class="estado-viaje__punto estado-viaje__punto--si"></span>
            Viaje #{{ e.viaje_id }}
          </button>
          <span v-else class="estado-viaje">
            <span class="estado-viaje__punto"></span>
            Sin viaje
          </span>
        </td>
      </tr>
      <tr v-if="!cargando && embarques.length === 0">
        <td colspan="9" class="table__empty">No hay embarques para hoy.</td>
      </tr>

    </tbody>
  </table>
</template>

<style scoped>
.table { width: 100%; border-collapse: collapse; }
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
.table tbody tr:last-child td { border-bottom: none; }
.table__empty { text-align: center; color: var(--color-text-muted); padding: var(--space-6); }

.estado-viaje {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}

.estado-viaje__punto {
  display: inline-block;
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-text-faint);
}

.estado-viaje__punto--si {
  background-color: var(--color-success);
}

.estado-viaje--link {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.estado-viaje--link:hover {
  text-decoration: underline;
}

</style>
