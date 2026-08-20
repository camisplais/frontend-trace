import { ref } from 'vue'
import { clientesService } from '@/services/clientes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { Cliente, ClientesMeta, TipoCliente } from '@/types/cliente'

const PER_PAGE = 5

/**
 * Estado y lógica de la lista de Clientes: filtros (nombre, ciudad, tipo),
 * carga paginada y borrado. La vista solo orquesta.
 */
export function useClientesLista() {
  const nombre = ref('')
  const ciudad = ref('')
  const tipo = ref<TipoCliente | ''>('')

  const clientes = ref<Cliente[]>([])
  const meta = ref<ClientesMeta | null>(null)
  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar(page: number) {
    cargando.value = true
    error.value = null
    try {
      const res = await clientesService.buscar({
        search: nombre.value || undefined,
        ciudad: ciudad.value || undefined,
        tipo: tipo.value || undefined,
        page,
        per_page: PER_PAGE,
      })
      clientes.value = res.data
      meta.value = res.meta
    } catch (e) {
      await alerta.error(
        'No se pudieron cargar los clientes',
        e instanceof ApiError ? e.message : undefined,
      )
    } finally {
      cargando.value = false
    }
  }

  function aplicar() {
    cargar(1)
  }

  async function eliminar(id: number) {
    error.value = null
    try {
      await clientesService.eliminar(id)
      // Si borramos el último de la página, retrocede una página.
      const quedan = clientes.value.length - 1
      const page = meta.value?.page ?? 1
      await cargar(quedan === 0 && page > 1 ? page - 1 : page)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudo eliminar el cliente.'
    }
  }

  return {
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
  }
}
