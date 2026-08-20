<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import HistorialFiltros from '@/components/historial/HistorialFiltros.vue'
import EmbarquesTabla from '@/components/historial/EmbarquesTabla.vue'
import SeguimientoModal from '@/components/historial/SeguimientoModal.vue'
import { useHistorial } from '@/composables/useHistorial'
import { exportarCsv } from '@/services/export'
import { tipoEmbarqueLabel, type Embarque } from '@/types/embarque'

const {
  tipo,
  fechaDesde,
  fechaHasta,
  busqueda,
  embarques,
  meta,
  cargando,
  error,
  filtrados,
  indiceInicial,
  cargar,
  aplicar,
} = useHistorial()

const seleccionado = ref<Embarque | null>(null)

onMounted(() => cargar(1))

function exportar() {
  const filas = filtrados.value.map((e) => [
    e.cliente.nombre,
    e.plan_embarque,
    e.tarima,
    e.cantidad_piezas,
    tipoEmbarqueLabel[e.tipo],
    e.fecha,
  ])
  exportarCsv(
    'historial-embarques.csv',
    ['Cliente', 'Plan embarque', 'Tarimas', 'Piezas', 'Tipo', 'Fecha'],
    filas,
  )
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Historial</h1>
      <BaseButton variant="secondary" @click="exportar">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <path d="M7 10l5 5 5-5M12 15V3" />
          </svg>
        </template>
        Exportar
      </BaseButton>
    </header>

    <div class="card">
      <HistorialFiltros
        v-model:busqueda="busqueda"
        v-model:tipo="tipo"
        v-model:fecha-desde="fechaDesde"
        v-model:fecha-hasta="fechaHasta"
        @aplicar="aplicar"
      />

      <p v-if="error" class="banner banner--error">{{ error }}</p>

      <EmbarquesTabla
        :embarques="filtrados"
        :indice-inicial="indiceInicial"
        :cargando="cargando"
        @ver="seleccionado = $event"
      />

      <footer v-if="meta" class="table-footer">
        <span class="conteo">
          Mostrando {{ embarques.length }} de {{ meta.total }} registros
        </span>
        <BasePagination
          :page="meta.page"
          :total-pages="meta.totalPages"
          @change="cargar"
        />
      </footer>
    </div>

    <SeguimientoModal
      v-if="seleccionado"
      :embarque="seleccionado"
      @close="seleccionado = null"
    />
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
}

.banner {
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-4);
}

.banner--error {
  background-color: #fdecec;
  color: var(--color-danger);
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-5);
}

.conteo {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}
</style>
