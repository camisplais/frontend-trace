import { http } from '@/services/http'
import type {
  Cliente,
  ClientesRespuesta,
  ClientesFiltros,
  CrearClientePayload,
  ActualizarClientePayload,
} from '@/types/cliente'

export const clientesService = {
  /**
   * Lista de clientes para el dropdown del cronograma (todos, sin paginar).
   */
  async listar(): Promise<Cliente[]> {
    const res = await http.get<ClientesRespuesta>('/clientes', {
      query: { per_page: 100 },
    })
    return res.data
  },

  /**
   * Lista paginada con filtros para la pantalla de Clientes.
   * GET /clientes?search=&ciudad=&tipo=&page=&per_page=
   */
  async buscar(filtros: ClientesFiltros): Promise<ClientesRespuesta> {
    return http.get<ClientesRespuesta>('/clientes', {
      query: {
        search: filtros.search,
        ciudad: filtros.ciudad,
        tipo: filtros.tipo,
        page: filtros.page,
        per_page: filtros.per_page,
      },
    })
  },

  /** POST /clientes — el backend asigna las pruebas según el tipo. */
  async crear(payload: CrearClientePayload): Promise<Cliente> {
    return http.post<Cliente>('/clientes', { body: payload })
  },

  /** PUT /clientes/:id — solo el nombre. */
  async actualizar(id: number, payload: ActualizarClientePayload): Promise<Cliente> {
    return http.put<Cliente>(`/clientes/${id}`, { body: payload })
  },

  /** DELETE /clientes/:id — borrado lógico. */
  async eliminar(id: number): Promise<void> {
    await http.delete(`/clientes/${id}`)
  },
}