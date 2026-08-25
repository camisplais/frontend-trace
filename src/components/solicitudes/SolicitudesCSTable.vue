<script setup lang="ts">
import { onMounted } from 'vue'
import { useSolicitudesCoordinador } from '@/composables/useSolicitudesCS'
import BaseButton from '@/components/ui/BaseButton.vue'

const {
  solicitudesFiltradas, cargando, procesandoId,
  filtroEstado, filtroTipo, filtroDias,
  cargar, aceptar, rechazar,
} = useSolicitudesCoordinador()

onMounted(cargar)

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function etiquetaEstado(estado: string): string {
  if (estado === 'pendiente') return 'Pendiente'
  if (estado === 'aceptado') return 'Aceptada'
  if (estado === 'rechazado') return 'Rechazada'
  return estado
}

function etiquetaAceptar(tipo: string): string {
  return tipo === 'solicitarqr' ? 'Generar' : 'Habilitar'
}
</script>

<template>
  <div class="toolbar">
    <select v-model="filtroTipo" class="filtro">
      <option value="">Todos los tipos</option>
      <option value="solicitarqr">Código QR</option>
      <option value="pe_desfasadas">Habilitar registro</option>
    </select>

    <select v-model="filtroEstado" class="filtro">
      <option value="">Todos los estados</option>
      <option value="pendiente">Pendiente</option>
      <option value="aceptado">Aceptada</option>
      <option value="rechazado">Rechazada</option>
    </select>

    <select v-model="filtroDias" class="filtro">
      <option :value="7">Últimos 7 días</option>
      <option :value="15">Últimos 15 días</option>
      <option :value="30">Últimos 30 días</option>
      <option :value="null">Todas las fechas</option>
    </select>
  </div>

  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Solicitado por</th>
          <th>Tipo</th>
          <th>Plan embarque</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in solicitudesFiltradas" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.empleado_emisor.nombre }} {{ s.empleado_emisor.apellido_paterno }}</td>
          <td>
            <span v-if="s.tipo === 'solicitarqr'" class="tipo">
              <svg class="tipo__icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
              </svg>
              Código QR
            </span>
            <span v-else-if="s.tipo === 'pe_desfasadas'" class="tipo">
              <svg class="tipo__icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v5h5" />
                <path d="M3.05 13A9 9 0 106 5.3L3 8" />
                <path d="M12 7v5l4 2" />
              </svg>
              Habilitar registro
            </span>
            <span v-else>{{ s.tipo }}</span>
          </td>
          <td>{{ s.viaje_embarque.embarque.plan_embarque }}</td>
          <td>{{ formatearFecha(s.createdAt) }}</td>
          <td>
            <span class="badge" :class="`badge--${s.estado}`">{{ etiquetaEstado(s.estado) }}</span>
          </td>
          <td class="acciones">
            <template v-if="s.estado === 'pendiente'">
              <BaseButton
                variant="primary"
                :disabled="procesandoId === s.id"
                @click="aceptar(s.id)"
              >
                {{ procesandoId === s.id ? '...' : etiquetaAceptar(s.tipo) }}
              </BaseButton>
              <BaseButton
                variant="secondary"
                :disabled="procesandoId === s.id"
                @click="rechazar(s.id)"
              >
                Rechazar
              </BaseButton>
            </template>
            <span v-else class="acciones__vacio">—</span>
          </td>
        </tr>
        <tr v-if="!cargando && solicitudesFiltradas.length === 0">
          <td colspan="7" class="table__empty">No hay solicitudes que coincidan con los filtros.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.filtro {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  min-width: 160px;
}

.filtro:focus {
  outline: none;
  border-color: var(--color-primary);
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text);
  white-space: nowrap;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table__empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-6);
  white-space: normal;
}

.tipo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.tipo__icono {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}

.badge--pendiente {
  color: #b8860b;
  background-color: #fdf6e3;
}

.badge--aceptado {
  color: var(--color-success);
  background-color: #eefaf1;
}

.badge--rechazado {
  color: var(--color-danger);
  background-color: #fdecea;
}

.acciones {
  display: flex;
  gap: var(--space-2);
}

.acciones__vacio {
  color: var(--color-text-faint);
}

@media (max-width: 640px) {
  .filtro {
    flex: 1;
    min-width: 0;
  }
}
</style>
