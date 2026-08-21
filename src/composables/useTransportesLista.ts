import { ref, computed } from 'vue'
import { transportesService } from '@/services/transportes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { Transporte, EstadoTransporte } from '@/types/transporte'

const PER_PAGE = 8

/**
 * Estado y lógica de la lista de Transportes.
 *
 * El backend (GET /transportes) devuelve un arreglo plano sin paginar, así que
 * aquí guardamos el total en memoria y paginamos del lado del cliente para
 * reproducir la paginación del diseño. El filtro por estado sí lo resuelve la
 * API (query ?estado=).
 */
export function useTransportesLista() {
  const estado = ref<EstadoTransporte | ''>('')

  const todos = ref<Transporte[]>([])
  const page = ref(1)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(todos.value.length / PER_PAGE)),
  )

  /** Slice de la página actual. */
  const transportes = computed<Transporte[]>(() => {
    const inicio = (page.value - 1) * PER_PAGE
    return todos.value.slice(inicio, inicio + PER_PAGE)
  })

  async function cargar(nuevaPagina = 1) {
    cargando.value = true
    error.value = null
    try {
      todos.value = await transportesService.listar({
        estado: estado.value || undefined,
      })
      // Ajusta la página si quedó fuera de rango (ej. tras borrar).
      page.value = Math.min(nuevaPagina, totalPages.value)
    } catch (e) {
      await alerta.error(
        'No se pudieron cargar los transportes',
        e instanceof ApiError ? e.message : undefined,
      )
    } finally {
      cargando.value = false
    }
  }

  /** Aplica el filtro y vuelve a la primera página. */
  function aplicar() {
    cargar(1)
  }

  /** Limpia el filtro y recarga. */
  function limpiar() {
    estado.value = ''
    cargar(1)
  }

  function irAPagina(p: number) {
    if (p >= 1 && p <= totalPages.value) page.value = p
  }

  async function eliminar(id: number): Promise<boolean> {
    error.value = null
    try {
      await transportesService.eliminar(id)
      await cargar(page.value)
      return true
    } catch (e) {
      error.value =
        e instanceof ApiError ? e.message : 'No se pudo eliminar el transporte.'
      return false
    }
  }

  return {
    estado,
    transportes,
    page,
    totalPages,
    total: computed(() => todos.value.length),
    cargando,
    error,
    cargar,
    aplicar,
    limpiar,
    irAPagina,
    eliminar,
  }
}
