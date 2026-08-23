<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { usePruebasEntrega } from '@/composables/usePruebaEntrega'
import { clientesService } from '@/services/clientes.service'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Cliente } from '@/types/embarque'

const {
  clienteSeleccionado, documentos, page, totalPages, filtros, cargando,
  entrarACliente, volverAClientes, aplicarFiltros, irAPagina, abrirDocumento,
} = usePruebasEntrega()

const clientes = ref<Cliente[]>([])
const busquedaCliente = ref('')

onMounted(async () => {
  clientes.value = await clientesService.listar()
})

const clientesFiltrados = computed(() => {
  const q = busquedaCliente.value.trim().toLowerCase()
  if (!q) return clientes.value
  return clientes.value.filter((c) => c.nombre.toLowerCase().includes(q))
})

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX')
}
</script>

<template>
  <div class="pruebas-entrega">
    <header class="header">
      <h1>Pruebas de entrega</h1>
    </header>

    <!-- Nivel 1: carpetas de clientes -->
    <section v-if="!clienteSeleccionado" class="card">
      <input v-model="busquedaCliente" type="search" placeholder="Buscar cliente…" class="buscador" />

      <div class="grid-carpetas">
        <button v-for="c in clientesFiltrados" :key="c.id" class="carpeta" @click="entrarACliente(c)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="carpeta__icono">
            <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
          <span class="carpeta__nombre">{{ c.nombre }}</span>
        </button>
      </div>
    </section>

    <!-- Nivel 2: documentos del cliente -->
    <section v-else class="card">
      <button class="volver" type="button" @click="volverAClientes">← Volver a clientes</button>
      <h2>{{ clienteSeleccionado.nombre }}</h2>

      <div class="filtros">
        <input v-model="filtros.search" type="search" placeholder="Buscar documento…" />
        <select v-model="filtros.tipo">
          <option value="">Todos</option>
          <option value="regular">Regular</option>
          <option value="expeditado">Expeditado</option>
        </select>
        <input v-model="filtros.fechaInicio" type="date" />
        <input v-model="filtros.fechaFin" type="date" />
        <BaseButton @click="aplicarFiltros">Aplicar</BaseButton>
      </div>

      <p v-if="cargando">Cargando…</p>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Plan embarque</th>
            <th>Tipo</th>
            <th>Subido el</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doc in documentos" :key="doc.id">
            <td>{{ doc.documento_nombre }}</td>
            <td>{{ doc.plan_embarque }}</td>
            <td>{{ doc.tipo }}</td>
            <td>{{ formatearFecha(doc.createdAt) }}</td>
            <td>
              <button class="icono-btn" aria-label="Abrir documento" @click="abrirDocumento(doc.id)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </td>
          </tr>
          <tr v-if="!cargando && documentos.length === 0">
            <td colspan="5" class="table__empty">Sin documentos.</td>
          </tr>
        </tbody>
      </table>

      <BasePagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @change="irAPagina" />
    </section>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.buscador {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-5);
}

.grid-carpetas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-5);
}

.carpeta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

.carpeta:hover { background-color: var(--color-bg); }

.carpeta__icono { width: 48px; height: 48px; color: var(--color-primary); }
.carpeta__nombre { font-size: var(--fs-sm); font-weight: var(--fw-medium); text-align: center; }

.volver { background: none; border: none; color: var(--color-text-muted); margin-bottom: var(--space-3); cursor: pointer; }

.filtros { display: flex; gap: var(--space-3); margin: var(--space-4) 0 var(--space-5); flex-wrap: wrap; }
.filtros input, .filtros select { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border-strong); border-radius: var(--radius-sm); }

.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: var(--fs-xs); color: var(--color-text-muted); padding: var(--space-3); border-bottom: 1px solid var(--color-border); }
.table td { padding: var(--space-3); font-size: var(--fs-sm); border-bottom: 1px solid var(--color-border); }
.table__empty { text-align: center; color: var(--color-text-muted); padding: var(--space-6); }

.icono-btn { background: var(--color-bg); border: none; border-radius: var(--radius-sm); padding: var(--space-2); color: var(--color-text-muted); }
.icono-btn:hover { color: var(--color-primary); }
.icono-btn svg { width: 16px; height: 16px; display: block; }
</style>
