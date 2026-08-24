import { http } from '@/services/http'
import type { CrearSolicitudPayload, Solicitud, FiltrosSolicitudes } from '@/types/solicitud'

export const solicitudesService = {
  async crear(payload: CrearSolicitudPayload): Promise<Solicitud> {
    return http.post('/solicitudes', { body: payload })
  },

  async findAll(filtros: FiltrosSolicitudes): Promise<Solicitud[]> {
  return http.get('/solicitudes', { query: filtros })
},
}

