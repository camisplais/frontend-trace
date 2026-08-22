import { http } from '@/services/http'
import { env } from '@/config/env'
import type { Empleado, EmpleadosRespuesta } from '@/types/empleado'

/**
 * Convierte lo que devuelve el backend en `imagen` a una URL usable.
 * El backend ya la prefirma (URL absoluta); si llegara una clave, la resuelve
 * contra la base publica de imagenes. Mismo criterio que transportes.
 */
export function resolverImagenUrl(imagen: string | null): string | null {
  if (!imagen) return null
  if (/^https?:\/\//i.test(imagen)) return imagen
  return `${env.imagesBaseUrl}/${imagen.replace(/^\//, '')}`
}

export interface ListarEmpleadosParams {
  page?: number
  per_page?: number
  search?: string
}

/** Detalle de error por fila que devuelve el backend al importar (FILE_003). */
export interface ErrorImportacion {
  fila: number
  errores: string[]
}

export const empleadosService = {
  /** GET /empleados?page&per_page&search — paginado en servidor. */
  async listar(params: ListarEmpleadosParams = {}): Promise<EmpleadosRespuesta> {
    return http.get<EmpleadosRespuesta>('/empleados', {
      query: {
        page: params.page,
        per_page: params.per_page,
        search: params.search || undefined,
      },
    })
  },

  /**
   * POST /empleados — importa el Excel/CSV de empleados (multipart, campo `file`).
   * Devuelve { data, msg } con los empleados creados.
   */
  async importarExcel(
    archivo: File,
  ): Promise<{ data: Empleado[]; msg: string }> {
    const form = new FormData()
    form.append('file', archivo)
    return http.post<{ data: Empleado[]; msg: string }>('/empleados', { form })
  },

  /**
   * PATCH /empleados/:id/foto — sube/reemplaza la foto (multipart, campo `imagen`).
   */
  async subirFoto(
    id: number,
    imagen: File,
  ): Promise<{ data: Empleado; msg: string }> {
    const form = new FormData()
    form.append('imagen', imagen)
    return http.patch<{ data: Empleado; msg: string }>(
      `/empleados/${id}/foto`,
      { form },
    )
  },
}
