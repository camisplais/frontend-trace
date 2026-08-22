import { ref, computed } from 'vue'
import { empleadosService } from '@/services/empleados.service'
import { alerta } from '@/services/alerta'
import { ApiError } from '@/services/http'
import type { Empleado } from '@/types/empleado'

const POR_PAGINA = 5

/**
 * Maneja el listado de empleados del Coordinador de Stock:
 * carga paginada en servidor, busqueda libre y estado de carga.
 */
export function useEmpleadosLista() {
  const empleados = ref<Empleado[]>([])
  const busqueda = ref('')
  const page = ref(1)
  const total = ref(0)
  const totalPages = ref(1)
  const cargando = ref(false)

  const hayResultados = computed(() => total.value > 0)

  async function cargar(pagina = 1) {
    cargando.value = true
    try {
      const res = await empleadosService.listar({
        page: pagina,
        per_page: POR_PAGINA,
        search: busqueda.value.trim() || undefined,
      })
      empleados.value = res.data
      page.value = res.meta.page
      total.value = res.meta.total
      totalPages.value = res.meta.last_page
    } catch (e) {
      const msg =
        e instanceof ApiError ? e.message : 'No se pudo cargar la lista.'
      await alerta.error('Error al cargar empleados', msg)
    } finally {
      cargando.value = false
    }
  }

  /** Aplica la busqueda: siempre vuelve a la primera pagina. */
  function aplicar() {
    cargar(1)
  }

  /** Limpia la busqueda y recarga. */
  function limpiar() {
    busqueda.value = ''
    cargar(1)
  }

  function irAPagina(pagina: number) {
    cargar(pagina)
  }

  return {
    empleados,
    busqueda,
    page,
    total,
    totalPages,
    cargando,
    hayResultados,
    cargar,
    aplicar,
    limpiar,
    irAPagina,
  }
}
