import { http } from '@/services/http'
import type {
  TransporteEnPlanta,
  ChoferDisponible,
  DocumentoRequerido,
  CrearViajePayload,
} from '@/types/crearViaje'
import type { Embarque } from '@/types/embarque'
import type { Viaje } from '@/types/viajes'

export const crearViajeService = {
  async transportesEnPlanta(): Promise<{ data: TransporteEnPlanta[] }> {
    return http.get('/transportes/planta')
  },

  async choferesDisponibles(): Promise<{ data: ChoferDisponible[] }> {
    return http.get('/empleados/choferes')
  },

  async embarquesDeHoy(): Promise<{ data: Embarque[] }> {
    return http.get('/embarques', { query: { limit: 100, sin_viaje:true } })
  },

  // El controller regresa el array directo, no envuelto en { data }
  async documentosRequeridos(embarqueId: number): Promise<DocumentoRequerido[]> {
    return http.get(`/embarques/${embarqueId}/pruebas-entrega`)
  },

  async crear(payload: CrearViajePayload): Promise<Viaje> {
    return http.post('/viajes', { body: payload })
  },

  async subirDocumento(embarqueId: number, docClienteId: number, file: File): Promise<void> {
    const form = new FormData()
    form.append('file', file)
    return http.post(`/prueba-entrega-embarque/${embarqueId}/${docClienteId}`, { form })
  },
}
