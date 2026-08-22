import { http } from '@/services/http'
import type { Rol, Usuario } from '@/types/usuario'

export interface CrearCuentaPayload {
  username: string
  password: string
  rol_id: number
}

export interface EditarCuentaPayload {
  /** Solo se manda si cambio; el backend valida unicidad. */
  username?: string
  telefono?: string
}

export const usuariosService = {
  /** GET /roles — para el select de Rol / Permiso. */
  async listarRoles(): Promise<Rol[]> {
    return http.get<Rol[]>('/roles')
  },

  /** GET /usuarios/:id — detalle de la cuenta (trae el celular actual). */
  async obtener(id: number): Promise<Usuario> {
    return http.get<Usuario>(`/usuarios/${id}`)
  },

  /** POST /usuarios/empleado/:empleadoId — da de alta la cuenta. */
  async crear(empleadoId: number, payload: CrearCuentaPayload): Promise<Usuario> {
    return http.post<Usuario>(`/usuarios/empleado/${empleadoId}`, {
      body: payload,
    })
  },

  /** PATCH /usuarios/empleado/:empleadoId — username y/o celular. */
  async editar(empleadoId: number, payload: EditarCuentaPayload): Promise<Usuario> {
    return http.patch<Usuario>(`/usuarios/empleado/${empleadoId}`, {
      body: payload,
    })
  },

  /**
   * PATCH /usuarios/empleado/:empleadoId/password — va aparte porque el
   * backend valida complejidad y que no sea la misma contrasena actual.
   */
  async cambiarPassword(
    empleadoId: number,
    password: string,
  ): Promise<{ message: string }> {
    return http.patch<{ message: string }>(
      `/usuarios/empleado/${empleadoId}/password`,
      { body: { password } },
    )
  },
}
