import { http } from '@/services/http'
import type { Seguimimiento } from '@/types/seguimiento'

export const qrService = {
  async generarCodigo(viajeId: number): Promise<Seguimimiento> {
    return http.get(`/qr/generar-codigo/${viajeId}`)
  },
}
