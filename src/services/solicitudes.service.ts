import { http } from '@/services/http'
import type { CrearSolicitudPayload, Solicitud } from '@/types/solicitud'

export const solicitudesService = {
  async crear(payload: CrearSolicitudPayload): Promise<Solicitud> {
    return http.post('/solicitudes', { body: payload })
  },
}
