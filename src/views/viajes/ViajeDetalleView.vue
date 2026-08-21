<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useViajeDetalle } from '@/composables/useViajeDetalle'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlanChip from '@/components/ui/PlanChip.vue'

const route = useRoute()
const router = useRouter()

const viajeId = Number(route.params.id)
const { viaje, seguimiento, pruebasPorEmbarque, cargando, cargar } = useViajeDetalle(viajeId)

onMounted(cargar)

function formatearHora(iso: string | null | undefined): string {
  if (!iso) return 'Pendiente'
  return new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

function nombreCompleto(empleado: { nombre: string; apellido_paterno: string } | null | undefined): string {
  if (!empleado) return '—'
  return `${empleado.nombre} ${empleado.apellido_paterno}`
}

function inicial(nombre: string): string {
  return nombre.charAt(0).toUpperCase()
}

// El nombre del archivo real vive codificado dentro de la URL firmada de S3;
// lo extraemos para mostrarlo como en el diseño (ej. "TysonFactura...pdf")
function nombreArchivo(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const partes = pathname.split('/')
    return decodeURIComponent(partes[partes.length - 1] ?? 'archivo')
  } catch {
    return 'archivo'
  }
}

const clientesEnViaje = computed(() => viaje.value?.viaje_embarques.length ?? 0)
</script>

<template>
  <div class="detalle-viaje">
    <button class="volver" type="button" @click="router.push({ name: 'viajes' })">
      ← Volver a Viajes
    </button>

    <p v-if="cargando">Cargando…</p>

    <section v-else-if="viaje" class="card">
      <div class="card__header">
        <div>
          <h2>Detalle del viaje</h2>
          <p class="subtitulo">
            Viaje #{{ viaje.id }} · {{ viaje.transporte?.marca }} {{ viaje.transporte?.placas }} ·
            Chofer {{ nombreCompleto(viaje.empleado_chofer) }}
          </p>
        </div>
      </div>

      <div class="resumen">
        <div class="resumen__item">
          <span class="resumen__label">Hora salida</span>
          <span class="resumen__valor">{{ formatearHora(seguimiento?.hora_salida) }}</span>
        </div>
        <div class="resumen__item">
          <span class="resumen__label">Hora entrada</span>
          <span class="resumen__valor">{{ formatearHora(seguimiento?.hora_entrada) }}</span>
        </div>
        <div class="resumen__item">
          <span class="resumen__label">Clientes en el viaje</span>
          <span class="resumen__valor">{{ clientesEnViaje }}</span>
        </div>
      </div>

      <div v-for="ve in viaje.viaje_embarques" :key="ve.id" class="embarque-card">
        <div class="embarque-card__header">
          <div class="embarque-card__cliente">
            <span class="avatar">{{ inicial(ve.embarque?.cliente.nombre ?? '?') }}</span>
            <span class="cliente-nombre">{{ ve.embarque?.cliente.nombre }}</span>
          </div>
          <PlanChip v-if="ve.embarque" :label="ve.embarque.plan_embarque" />
        </div>

        <div class="embarque-card__datos">
          <div>
            <span class="dato-label">Piezas</span>
            <span class="dato-valor">{{ ve.embarque?.cantidad_piezas }}</span>
          </div>
          <div>
            <span class="dato-label">Tarimas</span>
            <span class="dato-valor">{{ ve.embarque?.tarima }}</span>
          </div>
          <div>
            <span class="dato-label">Customer Service</span>
            <span class="dato-valor">{{ nombreCompleto(ve.embarque?.empleado) }}</span>
          </div>
        </div>

        <div class="pruebas">
          <span class="dato-label">Pruebas de entrega</span>
          <ul v-if="ve.embarque_id && pruebasPorEmbarque[ve.embarque_id]?.length">
            <li v-for="prueba in pruebasPorEmbarque[ve.embarque_id]" :key="prueba.id">
              <a :href="prueba.url" target="_blank" rel="noopener">{{ nombreArchivo(prueba.url) }}</a>
            </li>
          </ul>
          <p v-else class="sin-pruebas">Sin documentos.</p>
        </div>
      </div>

      <div class="acciones">
        <BaseButton variant="secondary" @click="router.push({ name: 'viajes' })">Cerrar</BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detalle-viaje {
  max-width: 900px;
  margin: 0 auto;
}

.volver {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-4);
  cursor: pointer;
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.card__header h2 {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
}

.subtitulo {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-top: var(--space-1);
}

.resumen {
  display: flex;
  gap: var(--space-6);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-5) 0;
}

.resumen__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.resumen__label {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.resumen__valor {
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
}

.embarque-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
  overflow: hidden;
}

.embarque-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background-color: var(--color-bg);
}

.embarque-card__cliente {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: #3a3a3a;
  color: #fff;
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
}

.cliente-nombre {
  font-weight: var(--fw-semibold);
}

.embarque-card__datos {
  display: flex;
  gap: var(--space-6);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.dato-label {
  display: block;
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin-bottom: var(--space-1);
}

.dato-valor {
  font-weight: var(--fw-medium);
}

.pruebas {
  padding: var(--space-4);
}

.pruebas ul {
  margin-top: var(--space-2);
}

.pruebas li {
  margin-bottom: var(--space-2);
}

.pruebas a {
  color: var(--color-info-text);
  font-size: var(--fs-sm);
}

.sin-pruebas {
  color: var(--color-text-faint);
  font-size: var(--fs-sm);
}

.acciones {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-5);
}
</style>
