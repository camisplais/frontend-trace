<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { seguimientoService, type SeguimientoDetalle } from '@/services/seguimiento.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'


const props = defineProps<{ viajeId: number }>()
const emit = defineEmits<{ close: [] }>()

const seguimiento = ref<SeguimientoDetalle | null>(null)
const cargando = ref(false)

onMounted(async () => {
  cargando.value = true
  try {
    seguimiento.value = await seguimientoService.porViaje(props.viajeId)
  } catch (e) {
    if (e instanceof ApiError) alerta.error(e.code, e.message)
    else alerta.error('Error', 'No se pudo cargar el seguimiento.')
    emit('close')
  } finally {
    cargando.value = false
  }
})

function formatearHora(iso: string | null | undefined): string {
  if (!iso) return 'pendiente'
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

import type { EmpleadoSeguimiento } from '@/services/seguimiento.service'

function nombreEmpleado(empleado: EmpleadoSeguimiento): string {
  return empleado.estado === 'asignado' && empleado.nombre ? empleado.nombre : 'pendiente'
}
</script>

<template>
  <BaseModal title="Seguimiento del viaje" size="lg" @close="emit('close')">
    <p v-if="cargando">Cargando…</p>
    <table v-else-if="seguimiento" class="tabla-seguimiento">
      <thead>
        <tr>
          <th>Hora salida</th>
          <th>Empleado salida</th>
          <th>Hora entrada</th>
          <th>Empleado entrada</th>
          <th>QR salida</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ formatearHora(seguimiento.hora_salida) }}</td>
          <td>{{ nombreEmpleado(seguimiento.empleado_caseta_salida) }}</td>
          <td>{{ formatearHora(seguimiento.hora_entrada) }}</td>
          <td>{{ nombreEmpleado(seguimiento.empleado_caseta_entrada) }}</td>
          <td>{{ nombreEmpleado(seguimiento.empleado_qr_salida) }}</td>
        </tr>
      </tbody>
    </table>
  </BaseModal>
</template>

<style scoped>
.tabla-seguimiento {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--fs-sm);
  table-layout: fixed;
}
.tabla-seguimiento th,
.tabla-seguimiento td {
  padding: var(--space-2) var(--space-2);
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.tabla-seguimiento th {
  text-align: left;
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}
</style>
