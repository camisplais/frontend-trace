<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { tipoEmbarqueLabel, type Embarque } from '@/types/embarque'

/**
 * Muestra el seguimiento (hora entrada / salida) de un embarque.
 *
 * El encabezado usa datos del embarque que ya tenemos. La lista de
 * entradas/salidas vendría de un endpoint de seguimiento por embarque que
 * aún no existe en el backend, por eso de momento se muestra vacía.
 */
interface Movimiento {
  entrada: string | null
  salida: string | null
}

defineProps<{
  embarque: Embarque
  movimientos?: Movimiento[]
}>()

const emit = defineEmits<{ close: [] }>()
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
          <th>Hora Entrada</th>
          <th>Hora Salida</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(m, i) in movimientos ?? []" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ m.entrada ?? '—' }}</td>
          <td>{{ m.salida ?? '—' }}</td>
        </tr>
        <tr v-if="!movimientos || movimientos.length === 0">
          <td colspan="3" class="mov__empty">Sin registros de seguimiento aún.</td>
        </tr>
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
