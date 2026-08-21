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

export const seguimientoService = {
  async porViaje(viajeId: number): Promise<SeguimientoDetalle> {
    const res = await http.get<{ data: SeguimientoDetalle; msg: unknown }>(
      `/seguimiento-viaje/viaje/${viajeId}`,
    )
    return res.data
  },
}
