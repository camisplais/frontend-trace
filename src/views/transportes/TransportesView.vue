<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasePagination from '@/components/ui/BasePagination.vue'
import TransportesFiltros from '@/components/transportes/TransportesFiltros.vue'
import TransportesGrid from '@/components/transportes/TransportesGrid.vue'
import EditarTransporteModal from '@/components/transportes/EditarTransporteModal.vue'
import { useTransportesLista } from '@/composables/useTransportesLista'
import { transportesService } from '@/services/transportes.service'
import { alerta } from '@/services/alerta'
import { ApiError } from '@/services/http'
import type { Transporte } from '@/types/transporte'

const router = useRouter()
const {
  estado,
  transportes,
  page,
  totalPages,
  total,
  cargando,
  error,
  cargar,
  aplicar,
  limpiar,
  irAPagina,
  eliminar,
} = useTransportesLista()

const enEdicion = ref<Transporte | null>(null)
const guardandoEdicion = ref(false)

onMounted(() => cargar(1))

async function guardarEdicion(cambios: { placas: string; imagen: File | null }) {
  if (!enEdicion.value) return
  guardandoEdicion.value = true
  try {
    await transportesService.actualizar(enEdicion.value.id, {
      placas: cambios.placas,
      imagen: cambios.imagen,
    })
    enEdicion.value = null
    await cargar(page.value)
    await alerta.exito('¡Cambios guardados!', 'La información se guardó correctamente.')
  } catch (e) {
    if (e instanceof ApiError) {
      await alerta.errorCodigo('Revisa el formulario', e.message, e.code)
    } else {
      await alerta.error('No se pudo actualizar', 'Ocurrió un error inesperado.')
    }
  } finally {
    guardandoEdicion.value = false
  }
}

async function pedirEliminar(transporte: Transporte) {
  const ok = await alerta.confirmar('¿Está seguro de eliminar este registro?', {
    texto: `Se eliminará la unidad ${transporte.marca} (${transporte.placas}).`,
    confirmText: 'OK',
  })
  if (!ok) return
  const eliminado = await eliminar(transporte.id)
  if (eliminado) {
    await alerta.exito('Registro eliminado', 'El transporte se eliminó correctamente.')
  } else {
    await alerta.error('No se pudo eliminar', error.value ?? undefined)
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Transportes</h1>
      <button
        class="fab"
        aria-label="Registrar transporte"
        @click="router.push({ name: 'transportes-registrar' })"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </header>

    <div class="card">
      <TransportesFiltros
        v-model:estado="estado"
        @aplicar="aplicar"
        @cancelar="limpiar"
      />

      <TransportesGrid
        :transportes="transportes"
        :cargando="cargando"
        @editar="enEdicion = $event"
        @eliminar="pedirEliminar"
      />

      <footer v-if="total > 0" class="table-footer">
        <span class="conteo">Mostrando {{ transportes.length }} de {{ total }} registros</span>
        <BasePagination :page="page" :total-pages="totalPages" @change="irAPagina" />
      </footer>
    </div>

    <EditarTransporteModal
      v-if="enEdicion"
      :transporte="enEdicion"
      :guardando="guardandoEdicion"
      @guardar="guardarEdicion"
      @close="enEdicion = null"
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

.fab {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
}

.fab:hover {
  background-color: var(--color-primary-hover);
}

.fab svg {
  width: 22px;
  height: 22px;
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
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
