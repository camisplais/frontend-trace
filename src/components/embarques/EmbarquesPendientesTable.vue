<!-- src/components/EmbarquesPendientesTable.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmbarquesPendientes } from '@/composables/useEmbarquesPendientes'
import ModalSubirPruebas from '@/components/embarques/ModalSubirPruebas.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TipoBadge from '@/components/ui/TipoBadge.vue'
import PlanChip from '@/components/ui/PlanChip.vue'

const {
  cargando, solicitandoId,
  filtroClienteId, clientesDisponibles, pendientesFiltrados,
  modalAbierto, itemModal, docsFaltantes, cargandoDocs,
  archivosPorDoc, subidoPorDoc, subiendoPorDoc,
  cargar, estadoFila, solicitar, abrirModalSubir, elegirArchivo, subirDocumento, cerrarModal,
} = useEmbarquesPendientes()

onMounted(cargar)

function onFileChange(docId: number, event: Event) {
  const input = event.target as HTMLInputElement
  console.log('onFileChange llamado:', docId, input.files?.[0])
  elegirArchivo(docId, input.files?.[0] ?? null)
}
</script>

<template>
  <div class="toolbar">
    <select v-model.number="filtroClienteId" class="filtro-cliente">
      <option :value="null">Todos los clientes</option>
      <option v-for="c in clientesDisponibles" :key="c.id" :value="c.id">{{ c.nombre }}</option>
    </select>
  </div>

  <div class="table-wrapper">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Cliente</th>
          <th>Plan embarque</th>
          <th>Tarimas</th>
          <th>Piezas</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in pendientesFiltrados" :key="item.embarque.id">
          <td>{{ item.embarque.id }}</td>
          <td>{{ item.embarque.cliente.nombre }}</td>
          <td><PlanChip :label="item.embarque.plan_embarque" /></td>
          <td>{{ item.embarque.tarima }}</td>
          <td>{{ item.embarque.cantidad_piezas }}</td>
          <td><TipoBadge :tipo="item.embarque.tipo" /></td>
          <td>{{ item.embarque.fecha }}</td>
          <td>{{ item.embarque.estado }}</td>
          <td class="acciones">
          <span v-if="item.viaje_embarque_id === null" class="badge badge--muted">
            Sin viaje asignado
          </span>

          <BaseButton
            v-else-if="estadoFila(item) === 'sin_solicitud'"
            variant="secondary"
            :disabled="solicitandoId === item.viaje_embarque_id"
            @click="solicitar(item)"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 18l4-4-1.5-1.5-4 4V18h1.5z" />
              </svg>
            </template>
            {{ solicitandoId === item.viaje_embarque_id ? 'Enviando…' : 'Solicitar' }}
          </BaseButton>

          <span v-else-if="estadoFila(item) === 'pendiente'" class="badge badge--pendiente">
            Esperando aprobación
          </span>

          <BaseButton
            v-else-if="estadoFila(item) === 'aceptado'"
            variant="primary"
            @click="abrirModalSubir(item)"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M12 12v6M9 15h6" />
              </svg>
            </template>
            Subir pruebas
          </BaseButton>
        </td>
        </tr>
        <tr v-if="!cargando && pendientesFiltrados.length === 0">
          <td colspan="9" class="table__empty">No hay embarques con pruebas pendientes.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <ModalSubirPruebas
    :visible="modalAbierto"
    :item="itemModal"
    :docs-faltantes="docsFaltantes"
    :cargando-docs="cargandoDocs"
    :archivos-por-doc="archivosPorDoc"
    :subido-por-doc="subidoPorDoc"
    :subiendo-por-doc="subiendoPorDoc"
    @file-change="onFileChange"
    @subir="subirDocumento"
    @cerrar="cerrarModal"
  />
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-4);
}

.filtro-cliente {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
  min-width: 200px;
}

.filtro-cliente:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Responsivo: en vez de romper el layout de la tabla, la dejamos scrollear
   horizontalmente en pantallas chicas, para no perder las columnas */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  min-width: 720px;
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

.acciones {
  display: flex;
  align-items: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}

.badge--muted {
  color: var(--color-text-muted);
  background-color: var(--color-bg);
}

.badge--pendiente {
  color: #b8860b;
  background-color: #fdf6e3;
}

@media (max-width: 640px) {
  .toolbar {
    justify-content: stretch;
  }
  .filtro-cliente {
    width: 100%;
  }
}
</style>
