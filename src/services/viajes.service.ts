import { http } from '@/services/http'
import type { ViajesRespuesta, ViajesFiltros, Viaje } from '@/types/viajes'
import type { EmbarquePendiente } from '@/types/embarquePendiente'

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

  async obtenerDetalle(id: number): Promise<Viaje> {
    const res = await http.get<{ data: Viaje; msg: unknown }>(`/viajes/${id}`)
    return res.data
  },

  async agregarEmbarque(viajeId: number, embarqueId: number): Promise<void> {
    await http.post(`/viajes/${viajeId}/embarques`, { body: { embarque_id: embarqueId } })
  },

  async embarquesPendientes(viajeId: number): Promise<EmbarquePendiente[]> {
    return http.get<EmbarquePendiente[]>(`/viajes/${viajeId}/embarques-pendientes`)
  },
}
