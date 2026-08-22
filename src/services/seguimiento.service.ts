import { http } from '@/services/http'

export interface SeguimientoDetalle {
  hora_salida: string | null
  hora_entrada: string | null
  qr: string
  // No tipamos los empleados de caseta a detalle: no los vamos a mostrar todavía
  // en esta vista, y no vimos la forma exacta de formatearEmpleado().
  empleado_caseta_entrada: unknown
  empleado_caseta_salida: unknown
  empleado_qr_salida: unknown
}

/**
 * Un movimiento de seguimiento del embarque: corresponde a un viaje al que
 * pertenece el embarque, con sus horas de entrada/salida (ISO) si ya se
 * registraron. `entrada`/`salida` van en null mientras no haya paso por caseta.
 */
export interface MovimientoSeguimiento {
  viaje_id: number
  entrada: string | null
  salida: string | null
}

export const seguimientoService = {
  async porViaje(viajeId: number): Promise<SeguimientoDetalle> {
    const res = await http.get<{ data: SeguimientoDetalle; msg: unknown }>(
      `/seguimiento-viaje/viaje/${viajeId}`,
    )
    return res.data
  },

  /**
   * Seguimiento de un embarque (para el modal del Historial).
   * El backend resuelve embarque -> viaje -> seguimiento y devuelve un
   * movimiento por cada viaje al que pertenece el embarque.
   * GET /embarques/:id/seguimiento
   */
  async porEmbarque(embarqueId: number): Promise<MovimientoSeguimiento[]> {
    const res = await http.get<{ data: MovimientoSeguimiento[]; msg: unknown }>(
      `/embarques/${embarqueId}/seguimiento`,
    )
    return res.data
  },
}
