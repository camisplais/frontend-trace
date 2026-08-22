import { ref } from 'vue'
import {
  seguimientoService,
  type MovimientoSeguimiento,
} from '@/services/seguimiento.service'
import { alerta } from '@/services/alerta'
import { ApiError } from '@/services/http'
import type { Embarque } from '@/types/embarque'

/**
 * Maneja el modal de "Seguimiento del embarque" en el Historial:
 * qué embarque está seleccionado, la carga de sus movimientos
 * (entrada/salida por viaje) desde el backend y el estado de carga.
 */
export function useSeguimientoEmbarque() {
  const seleccionado = ref<Embarque | null>(null)
  const movimientos = ref<MovimientoSeguimiento[]>([])
  const cargando = ref(false)

  async function abrir(embarque: Embarque) {
    seleccionado.value = embarque
    movimientos.value = []
    cargando.value = true
    try {
      movimientos.value = await seguimientoService.porEmbarque(embarque.id)
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : 'No se pudo cargar el seguimiento.'
      await alerta.error('Error al cargar el seguimiento', msg)
    } finally {
      cargando.value = false
    }
  }

  function cerrar() {
    seleccionado.value = null
    movimientos.value = []
  }

  return { seleccionado, movimientos, cargando, abrir, cerrar }
}
