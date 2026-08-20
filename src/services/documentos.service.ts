import { http } from '@/services/http'
import type { Documento } from '@/types/cliente'

interface DocumentosResponse {
  data: Documento[]
}

export const documentosService = {
  /**
   * Catálogo de pruebas de entrega. GET /documentos
   * Se usa en Registrar Cliente para mostrar qué pruebas aplican por tipo.
   */
  async listar(): Promise<Documento[]> {
    const res = await http.get<DocumentosResponse>('/documentos')
    return res.data
  },
}
