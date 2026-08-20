import { http } from '@/services/http'
import type { ViajesRespuesta, ViajesFiltros } from '@/types/viajes'

export const viajesService = {
  async listar(filtros: ViajesFiltros): Promise<ViajesRespuesta> {
    return http.get<ViajesRespuesta>('/viajes', {
      query: {
        empleado_chofer_id: filtros.empleado_chofer_id,
        transporte_id: filtros.transporte_id,
        fecha_desde: filtros.fecha_desde,
        fecha_hasta: filtros.fecha_hasta,
        page: filtros.page,
        per_page: filtros.per_page,
      },
    })
  },
}
