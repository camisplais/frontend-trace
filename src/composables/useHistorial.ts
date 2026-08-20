import { ref, computed } from 'vue'
import { historialService } from '@/services/historial.service'
import { ApiError } from '@/services/http'
import type { Embarque, TipoEmbarque, PaginatedMeta } from '@/types/embarque'

const LIMIT = 5

/**
 * Encapsula el estado y la lógica del Historial (filtros, carga, paginación,
 * búsqueda de texto local y exportación de filas). La vista solo orquesta.
 */
export function useHistorial() {
  // Filtros que aplica el backend
  const tipo = ref<TipoEmbarque | ''>('')
  const fechaDesde = ref('')
  const fechaHasta = ref('')
  // Búsqueda de texto: local (el backend aún no la soporta)
  const busqueda = ref('')

  const embarques = ref<Embarque[]>([])
  const meta = ref<PaginatedMeta | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar(page: number) {
    cargando.value = true
    error.value = null
    try {
      const res = await historialService.listar({
        tipo: tipo.value || undefined,
        fecha_desde: fechaDesde.value || undefined,
        fecha_hasta: fechaHasta.value || undefined,
        page,
        limit: LIMIT,
      })
      embarques.value = res.data
      meta.value = res.meta
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudo cargar el historial.'
    } finally {
      cargando.value = false
    }
  }

  function aplicar() {
    cargar(1)
  }

  /** Filtro de texto sobre la página cargada (stopgap hasta soporte del backend). */
  const filtrados = computed(() => {
    const q = busqueda.value.trim().toLowerCase()
    if (!q) return embarques.value
    return embarques.value.filter(
      (e) =>
        e.cliente.nombre.toLowerCase().includes(q) ||
        e.plan_embarque.toLowerCase().includes(q),
    )
  })

  const indiceInicial = computed(() => {
    const page = meta.value?.page ?? 1
    return (page - 1) * LIMIT + 1
  })

  return {
    LIMIT,
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
  }
}
