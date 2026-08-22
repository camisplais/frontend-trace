<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { tipoEmbarqueLabel, type Embarque } from '@/types/embarque'
import type { MovimientoSeguimiento } from '@/services/seguimiento.service'

/**
 * Muestra el seguimiento (hora entrada / salida) de un embarque.
 *
 * El encabezado usa datos del embarque que ya tenemos. La lista de
 * movimientos la carga la vista desde GET /embarques/:id/seguimiento
 * (un renglón por viaje al que pertenece el embarque).
 */
defineProps<{
  embarque: Embarque
  movimientos?: MovimientoSeguimiento[]
  cargando?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

/** Formatea un datetime ISO a hora local; '—' si aún no hay registro. */
function formatearHora(iso: string | null): string {
  if (!iso) return '—'
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <BaseModal title="Seguimiento del embarque" @close="emit('close')">
    <div class="resumen">
      <div>
        <span class="resumen__label">Cliente</span>
        <span class="resumen__value">{{ embarque.cliente.nombre }}</span>
      </div>
      <div>
        <span class="resumen__label">Plan embarque</span>
        <span class="resumen__value">{{ embarque.plan_embarque }}</span>
      </div>
      <div>
        <span class="resumen__label">Tipo</span>
        <span class="resumen__value">{{ tipoEmbarqueLabel[embarque.tipo] }}</span>
      </div>
    </div>

    <table class="mov">
      <thead>
        <tr>
          <th>#</th>
          <th>Hora Salida</th>
          <th>Hora Entrada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="cargando">
          <td colspan="3" class="mov__empty">Cargando seguimiento…</td>
        </tr>
        <template v-else>
          <tr v-for="(m, i) in movimientos ?? []" :key="m.viaje_id">
            <td>{{ i + 1 }}</td>
            <td>{{ formatearHora(m.salida) }}</td>
            <td>{{ formatearHora(m.entrada) }}</td>
          </tr>
          <tr v-if="!movimientos || movimientos.length === 0">
            <td colspan="3" class="mov__empty">Sin registros de seguimiento aún.</td>
          </tr>
        </template>
      </tbody>
    </table>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cerrar</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.resumen {
  display: flex;
  gap: var(--space-6);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
}

.resumen__label {
  display: block;
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}

.resumen__value {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}

.mov {
  width: 100%;
  border-collapse: collapse;
}

.mov th {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.mov td {
  padding: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
}

.mov tbody tr:last-child td {
  border-bottom: none;
}

.mov__empty {
  color: var(--color-text-muted);
  text-align: center;
  font-size: var(--fs-sm);
}
</style>
