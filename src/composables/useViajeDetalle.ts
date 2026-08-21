import { ref } from 'vue'
import { viajesService } from '@/services/viajes.service'
import { seguimientoService, type SeguimientoDetalle } from '@/services/seguimiento.service'
import { pruebaEntregaService, type PruebaEntrega } from '@/services/pruebaEntrega.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { Viaje } from '@/types/viajes'

export function useViajeDetalle(viajeId: number) {
  const viaje = ref<Viaje | null>(null)
  const seguimiento = ref<SeguimientoDetalle | null>(null)
  const pruebasPorEmbarque = ref<Record<number, PruebaEntrega[]>>({})
  const cargando = ref(false)

  async function cargar() {
    cargando.value = true
    try {
      viaje.value = await viajesService.obtenerDetalle(viajeId)

      // El seguimiento puede no existir aún (viajes de prueba antiguos) —
      // no es un error real, solo lo tratamos como "sin datos todavía".
      try {
        seguimiento.value = await seguimientoService.porViaje(viajeId)
      } catch {
        seguimiento.value = null
      }

      const embarqueIds = viaje.value.viaje_embarques
        .map((ve) => ve.embarque_id)
        .filter((id): id is number => id !== null)

      const resultados = await Promise.all(
        embarqueIds.map((id) => pruebaEntregaService.porEmbarque(id).catch(() => [])),
      )
      embarqueIds.forEach((id, i) => {
        pruebasPorEmbarque.value[id] = resultados[i] ??[]
      })
    } catch (e) {
      if (e instanceof ApiError) alerta.error(e.code, e.message)
      else alerta.error('Error', 'No se pudo cargar el detalle del viaje.')
    } finally {
      cargando.value = false
    }
  }

  return { viaje, seguimiento, pruebasPorEmbarque, cargando, cargar }
}
