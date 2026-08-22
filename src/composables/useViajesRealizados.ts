import { ref } from 'vue'
import { viajesService } from '@/services/viajes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { Viaje, ViajesFiltros } from '@/types/viajes'

export function useViajesRealizados() {
  const viajes = ref<Viaje[]>([])
  const page = ref(1)
  const totalPages = ref(1)
  const perPage = 7

  const filtros = ref<{ choferId: number | null; transporteId: number | null; fechaDesde: string; fechaHasta: string }>({
    choferId: null,
    transporteId: null,
    fechaDesde: '',
    fechaHasta: '',
})

  const cargando = ref(false)

  // Cache de detalles de viaje ya cargados (para no repetir el findOne al re-abrir un acordeón)
  const detallesPorViaje = ref<Record<number, Viaje>>({})
  const filaExpandida = ref<number | null>(null)
  const cargandoDetalle = ref<number | null>(null)

  async function cargar() {
    cargando.value = true
    try {
      const f: ViajesFiltros = { page: page.value, per_page: perPage }
      if (filtros.value.choferId) f.empleado_chofer_id = filtros.value.choferId
      if (filtros.value.transporteId) f.transporte_id = filtros.value.transporteId
      if (filtros.value.fechaDesde) f.fecha_desde = filtros.value.fechaDesde
      if (filtros.value.fechaHasta) f.fecha_hasta = filtros.value.fechaHasta

      const resp = await viajesService.listar(f)
      viajes.value = resp.data
      totalPages.value = resp.meta.last_page
    } catch (e) {
      if (e instanceof ApiError) alerta.error(e.code, e.message)
      else alerta.error('Error', 'No se pudieron cargar los viajes.')
    } finally {
      cargando.value = false
    }
  }

  function irAPagina(p: number) {
    page.value = p
    cargar()
  }

  async function toggleAcordeon(viajeId: number) {
    if (filaExpandida.value === viajeId) {
      filaExpandida.value = null
      return
    }
    filaExpandida.value = viajeId

    // Ya lo cargamos antes: no repetir la petición
    if (detallesPorViaje.value[viajeId]) return

    cargandoDetalle.value = viajeId
    try {
      detallesPorViaje.value[viajeId] = await viajesService.obtenerDetalle(viajeId)
    } catch (e) {
      if (e instanceof ApiError) alerta.error(e.code, e.message)
      else alerta.error('Error', 'No se pudo cargar el detalle del viaje.')
      filaExpandida.value = null
    } finally {
      cargandoDetalle.value = null
    }
  }

  return {
    viajes, page, totalPages, filtros, cargando,
    detallesPorViaje, filaExpandida, cargandoDetalle,
    cargar, irAPagina, toggleAcordeon,
  }
}
