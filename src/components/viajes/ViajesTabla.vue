<script setup lang="ts">
import type { Viaje, EmpleadoDetalle } from '@/types/viajes'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps<{
  viajes: Viaje[]
  cargando?: boolean
}>()

function nombreCompleto(empleado: EmpleadoDetalle | null): string {
  if (!empleado) return '—'
  return `${empleado.nombre} ${empleado.apellido_paterno}`
}

function formatearHora(isoDatetime: string | null | undefined): string {
  if (!isoDatetime) return 'Pendiente'
  return new Date(isoDatetime).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Transporte</th>
        <th>Chofer</th>
        <th>Hora salida</th>
        <th>Hora entrada</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="v in viajes" :key="v.id">
        <td>{{ v.id }}</td>
        <td>{{ v.transporte?.placas ?? '—' }}</td>
        <td>{{ nombreCompleto(v.empleado_chofer) }}</td>
        <td>{{ formatearHora(v.seguimiento?.salida) }}</td>
        <td>{{ formatearHora(v.seguimiento?.entrada) }}</td>
        <td class="acciones">
          <button class="icono-btn" aria-label="Agregar embarque" @click="router.push({ name: 'agregar-embarque', params: { id: v.id } })">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <button class="icono-btn" aria-label="Ver detalle" @click="router.push({ name: 'viaje-detalle', params: { id: v.id } })">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button class="icono-btn" aria-label="Generar QR">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
            </svg>
          </button>
        </td>
      </tr>
      <tr v-if="!cargando && viajes.length === 0">
        <td colspan="6" class="table__empty">No hay viajes registrados hoy.</td>
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

.acciones { display: flex; gap: var(--space-2); }
.icono-btn {
  background: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  color: var(--color-text-muted);
}
.icono-btn:hover { color: var(--color-primary); }
.icono-btn svg { width: 16px; height: 16px; display: block; }
</style>
