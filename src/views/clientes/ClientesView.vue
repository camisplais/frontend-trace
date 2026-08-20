<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BasePagination from '@/components/ui/BasePagination.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ClientesFiltros from '@/components/clientes/ClientesFiltros.vue'
import ClientesTabla from '@/components/clientes/ClientesTabla.vue'
import EditarClienteModal from '@/components/clientes/EditarClienteModal.vue'
import { useClientesLista } from '@/composables/useClientesLista'
import { clientesService } from '@/services/clientes.service'
import { ApiError } from '@/services/http'
import type { Cliente } from '@/types/cliente'

const router = useRouter()
const {
  nombre,
  ciudad,
  tipo,
  clientes,
  meta,
  cargando,
  error,
  cargar,
  aplicar,
  eliminar,
} = useClientesLista()

const enEdicion = ref<Cliente | null>(null)
const guardandoEdicion = ref(false)
const aEliminar = ref<Cliente | null>(null)

onMounted(() => cargar(1))

const indiceInicial = computed(() => {
  if (!meta.value) return 1
  return (meta.value.page - 1) * meta.value.per_page + 1
})

async function guardarEdicion(nuevoNombre: string) {
  if (!enEdicion.value) return
  guardandoEdicion.value = true
  try {
    await clientesService.actualizar(enEdicion.value.id, { nombre: nuevoNombre })
    enEdicion.value = null
    await cargar(meta.value?.page ?? 1)
  } catch (e) {
    error.value = e instanceof ApiError ? e.message : 'No se pudo actualizar el cliente.'
  } finally {
    guardandoEdicion.value = false
  }
}

async function confirmarEliminar() {
  if (!aEliminar.value) return
  await eliminar(aEliminar.value.id)
  aEliminar.value = null
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Clientes</h1>
      <button class="fab" aria-label="Registrar cliente" @click="router.push({ name: 'clientes-registrar' })">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </header>

    <div class="card">
      <ClientesFiltros
        v-model:nombre="nombre"
        v-model:ciudad="ciudad"
        v-model:tipo="tipo"
        @aplicar="aplicar"
      />

      <p v-if="error" class="banner banner--error">{{ error }}</p>

      <ClientesTabla
        :clientes="clientes"
        :indice-inicial="indiceInicial"
        :cargando="cargando"
        @editar="enEdicion = $event"
        @eliminar="aEliminar = $event"
      />

      <footer v-if="meta" class="table-footer">
        <span class="conteo">
          Mostrando {{ clientes.length }} de {{ meta.total }} registros
        </span>
        <BasePagination :page="meta.page" :total-pages="meta.last_page" @change="cargar" />
      </footer>
    </div>

    <EditarClienteModal
      v-if="enEdicion"
      :cliente="enEdicion"
      :guardando="guardandoEdicion"
      @guardar="guardarEdicion"
      @close="enEdicion = null"
    />

    <ConfirmDialog
      v-if="aEliminar"
      title="Eliminar cliente"
      :message="`¿Seguro que deseas eliminar a ${aEliminar.nombre}? Esta acción no se puede deshacer.`"
      @confirm="confirmarEliminar"
      @close="aEliminar = null"
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
