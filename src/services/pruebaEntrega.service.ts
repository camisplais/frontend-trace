import { http } from '@/services/http'
import type { FiltroPruebas } from '@/types/pruebaEntrega'
import type { DocumentosRespuesta } from '@/types/pruebaEntrega'

export interface PruebaEntrega {
  id: number
  documento_nombre: string
  url: string
  createdAt: string
}

export const pruebaEntregaService = {
  async porEmbarque(embarqueId: number): Promise<PruebaEntrega[]> {
    const res = await http.get<{ data: PruebaEntrega[]; msg: unknown }>(
      `/prueba-entrega-embarque/embarque/${embarqueId}`,
    )
    return res.data
  },

  async listarDocumentos(filtros: FiltroPruebas): Promise<DocumentosRespuesta> {
    return http.get<DocumentosRespuesta>('/prueba-entrega-embarque/listar-documentos', {
      query: {
        cliente_id: filtros.cliente_id,
        anio: filtros.anio,
        mes: filtros.mes,
        tipo: filtros.tipo,
        search: filtros.search,
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
        page: filtros.page,
        limit: filtros.limit,
      },
    })
  },

  async obtenerUrl(id: number): Promise<string> {
    const res = await http.get<{ url: string }>(`/prueba-entrega-embarque/${id}/url`)
    return res.url
  },
}
