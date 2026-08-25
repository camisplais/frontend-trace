<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useViajesRealizados } from '@/composables/useViajesRealizados'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SeguimientoModal from '@/components/viajesRealizados/SeguimientoModal.vue'
import PruebasEntregaModal from '@/components/viajesRealizados/PruebasEntregaModal.vue'
import { transportesService } from '@/services/transportes.service'
import type { Transporte } from '@/types/transporte'
import { http } from '@/services/http'
import type { ChoferDisponible } from '@/types/crearViaje'
import { useAuthStore } from '@/stores/auth'
import { Role } from '@/types/roles'

const {
  viajes, page, totalPages, filtros,
  detallesPorViaje, filaExpandida, cargandoDetalle,
  cargar, irAPagina, toggleAcordeon,
} = useViajesRealizados()

const auth = useAuthStore()
const esAduanas = computed(() => auth.role === Role.ADUANAS)

const transportes = ref<Transporte[]>([])
const choferes = ref<ChoferDisponible[]>([])

onMounted(async () => {
  cargar()
  const [transportesRes, choferesRes] = await Promise.all([
    transportesService.listar(),
    http.get<{ data: ChoferDisponible[] }>('/empleados/choferes'),
  ])
  transportes.value = transportesRes
  choferes.value = choferesRes.data
})

function aplicarFiltros() {
  page.value = 1
  cargar()
}

const modalSeguimientoViajeId = ref<number | null>(null)
const modalPruebasEmbarqueId = ref<number | null>(null)

function nombreCompleto(empleado: { nombre: string; apellido_paterno: string } | null | undefined): string {
  if (!empleado) return '—'
  return `${empleado.nombre} ${empleado.apellido_paterno}`
}
</script>

<template>
  <div class="viajes-realizados">
    <header class="header">
      <h1>Viajes realizados</h1>
    </header>

    <section class="card">
      <div class="filtros">
        <div class="campo">
          <label>Fecha inicio</label>
          <input v-model="filtros.fechaDesde" type="date" />
        </div>
        <div class="campo">
          <label>Fecha fin</label>
          <input v-model="filtros.fechaHasta" type="date" />
        </div>
        <div class="campo">
          <label>Chofer</label>
          <select v-model.number="filtros.choferId">
            <option :value="null">Todos</option>
            <option v-for="c in choferes" :key="c.id" :value="c.id">{{ c.nombre }} {{ c.apellido_paterno }}</option>
          </select>
        </div>
        <div class="campo">
          <label>Transporte</label>
          <select v-model.number="filtros.transporteId">
            <option :value="null">Todos</option>
            <option v-for="t in transportes" :key="t.id" :value="t.id">{{ t.placas }}</option>
          </select>
        </div>
        <BaseButton @click="aplicarFiltros">Aplicar</BaseButton>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Chofer</th>
            <th>Empleado embarques</th>
            <th>Transporte</th>
            <th>Seguimiento</th>
            <th>Embarques</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="v in viajes" :key="v.id">
            <tr>
              <td>{{ v.id }}</td>
              <td>{{ nombreCompleto(v.empleado_chofer) }}</td>
              <td>{{ nombreCompleto(v.empleado_embarques) }}</td>
              <td>{{ v.transporte?.placas }}</td>
              <td>
                <button class="icono-btn" aria-label="Ver seguimiento" @click="modalSeguimientoViajeId = v.id">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </td>
              <td>
                <button class="icono-btn" aria-label="Ver embarques" @click="toggleAcordeon(v.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ transform: filaExpandida === v.id ? 'rotate(180deg)' : '' }">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </td>
              <td>{{ v.createdAt?.slice(0, 10) ?? '—' }}</td>
            </tr>
            <tr v-if="filaExpandida === v.id">
              <td colspan="7" class="acordeon-celda">
                <p v-if="cargandoDetalle === v.id">Cargando embarques…</p>
                <table v-else-if="detallesPorViaje[v.id]" class="tabla-embarques">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Plan embarque</th>
                      <th>Tarimas</th>
                      <th>Pzas</th>
                      <th>Tipo</th>
                      <th>Pruebas de entrega</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ve, i) in detallesPorViaje[v.id]?.viaje_embarques ?? []" :key="ve.id">
                      <td>{{ i + 1 }}</td>
                      <td>{{ ve.embarque?.cliente?.nombre ?? '—' }}</td>
                      <td>{{ ve.embarque?.plan_embarque }}</td>
                      <td>{{ ve.embarque?.tarima }}</td>
                      <td>{{ ve.embarque?.cantidad_piezas }}</td>
                      <td>{{ ve.embarque?.tipo }}</td>
                      <td>
                        <button v-if="ve.embarque_id" class="icono-btn" aria-label="Ver pruebas" @click="modalPruebasEmbarqueId = ve.embarque_id">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <BasePagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @change="irAPagina" />
    </section>

    <SeguimientoModal v-if="modalSeguimientoViajeId" :viaje-id="modalSeguimientoViajeId" @close="modalSeguimientoViajeId = null" />
    <PruebasEntregaModal v-if="modalPruebasEmbarqueId" :embarque-id="modalPruebasEmbarqueId" @close="modalPruebasEmbarqueId = null" />
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
.filtros { display: flex; align-items: flex-end; gap: var(--space-4); margin-bottom: var(--space-5); }
.campo { display: flex; flex-direction: column; gap: var(--space-1); }
.campo label { font-size: var(--fs-xs); color: var(--color-text-muted); }
.campo select, .campo input { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border-strong); border-radius: var(--radius-sm); }

.table { width: 100%; border-collapse: collapse; }
.table th { text-align: left; font-size: var(--fs-xs); color: var(--color-text-muted); padding: var(--space-3); border-bottom: 1px solid var(--color-border); }
.table td { padding: var(--space-3); font-size: var(--fs-sm); border-bottom: 1px solid var(--color-border); }

.acordeon-celda { background-color: var(--color-bg); padding: var(--space-4) !important; }
.tabla-embarques { width: 100%; border-collapse: collapse; }
.tabla-embarques th { text-align: left; font-size: var(--fs-xs); color: var(--color-text-muted); padding: var(--space-2); }
.tabla-embarques td { padding: var(--space-2); font-size: var(--fs-sm); }

.icono-btn { background: var(--color-bg); border: none; border-radius: var(--radius-sm); padding: var(--space-2); color: var(--color-text-muted); }
.icono-btn:hover { color: var(--color-primary); }
.icono-btn svg { width: 16px; height: 16px; display: block; }
</style>
