import { http } from '@/services/http'
import { env } from '@/config/env'
import type {
  Transporte,
  TransportesFiltros,
  CrearTransportePayload,
  ActualizarTransportePayload,
} from '@/types/transporte'

/**
 * Convierte lo que devuelve el backend en el campo `imagen` a una URL usable.
 * El backend puede devolver una URL absoluta o una clave de storage.
 */
export function resolverImagenUrl(imagen: string | null): string | null {
  if (!imagen) return null
  if (/^https?:\/\//i.test(imagen)) return imagen
  return `${env.imagesBaseUrl}/${imagen.replace(/^\//, '')}`
}

/** Arma el multipart/form-data para crear/editar (la imagen es un archivo). */
function construirFormData(
  campos: Record<string, string | undefined>,
  imagen?: File | null,
): FormData {
  const form = new FormData()
  for (const [clave, valor] of Object.entries(campos)) {
    if (valor !== undefined && valor !== '') form.append(clave, valor)
  }
  if (imagen) form.append('imagen', imagen)
  return form
}

export const transportesService = {
  /**
   * GET /transportes?estado=
   * El backend responde un arreglo plano (sin paginar); la paginación es
   * del lado del cliente (ver useTransportesLista).
   */
  async listar(filtros: TransportesFiltros = {}): Promise<Transporte[]> {
    return http.get<Transporte[]>('/transportes', {
      query: { estado: filtros.estado },
    })
  },

  /** GET /transportes/:id */
  async obtener(id: number): Promise<Transporte> {
    return http.get<Transporte>(`/transportes/${id}`)
  },

  /** POST /transportes — multipart. El backend fija estado = planta. */
  async crear(payload: CrearTransportePayload): Promise<Transporte> {
    const form = construirFormData(
      {
        marca: payload.marca,
        placas: payload.placas,
        carga_util: payload.carga_util,
      },
      payload.imagen,
    )
    return http.post<Transporte>('/transportes', { form })
  },

  /** PATCH /transportes/:id — multipart. Solo placas e imagen son editables. */
  async actualizar(
    id: number,
    payload: ActualizarTransportePayload,
  ): Promise<Transporte> {
    const form = construirFormData({ placas: payload.placas }, payload.imagen)
    return http.patch<Transporte>(`/transportes/${id}`, { form })
  },

  /** DELETE /transportes/:id — borrado lógico (soft delete). */
  async eliminar(id: number): Promise<void> {
    await http.delete(`/transportes/${id}`)
  },
}
