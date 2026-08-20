import { http } from '@/services/http'
import type { EmbarquesRespuesta, HistorialFiltros } from '@/types/embarque'

export const historialService = {
  /**
   * Lista de embarques con filtros y paginación.
   * GET /embarques?tipo=&fecha_desde=&fecha_hasta=&page=&limit=
   *
   * Nota: el backend NO soporta búsqueda por texto (cliente/plan) todavía;
   * eso se resuelve del lado del cliente en la vista mientras se agrega el
   * parámetro `search` al backend.
   */
  async listar(filtros: HistorialFiltros): Promise<EmbarquesRespuesta> {
    return http.get<EmbarquesRespuesta>('/embarques', {
      query: {
        tipo: filtros.tipo,
        fecha_desde: filtros.fecha_desde,
        fecha_hasta: filtros.fecha_hasta,
        page: filtros.page,
        limit: filtros.limit,
      },
    })
  },
}
