import { http } from '@/services/http'
import type { Cliente, PaginatedMeta } from '@/types/embarque'

interface ClientesResponse {
  data: Cliente[]
  meta: PaginatedMeta
}

export const clientesService = {
  /**
   * Lista de clientes para asignar en el cronograma.
   * GET /clientes  (se pide un per_page alto para traerlos todos en el dropdown).
   */
  async listar(): Promise<Cliente[]> {
    const res = await http.get<ClientesResponse>('/clientes', {
      query: { per_page: 100 },
    })
    return res.data
  },
}
