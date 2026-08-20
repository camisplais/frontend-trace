export interface EmpleadoDetalle {
  id: number
  no_empleado: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  departamento: string
  puesto: string
  estado: string
}

export interface TransporteResumen {
  id: number
  placas: string
  marca: string
  carga_util: string
  estado: string
}

/** Version simplificada del embarque, tal como viene dentro de un viaje (sin cliente). */
export interface ViajeEmbarqueDatos {
  id: number
  plan_embarque: string
  fecha: string
  hora: string
  tipo: 'regular' | 'expeditado'
  tarima: number
  cantidad_piezas: number
  estado: string
}

export interface ViajeEmbarqueItem {
  id: number
  viaje_id: number
  embarque_id: number | null
  embarque: ViajeEmbarqueDatos | null
}

export interface SeguimientoResumen {
  entrada: string | null  // datetime ISO, ej. "2026-08-20T14:10:00.000Z"
  salida: string | null
}

export interface Viaje {
  id: number
  empleado_chofer_id: number | null
  empleado_chofer: EmpleadoDetalle | null
  empleado_embarques_id: number | null
  empleado_embarques: EmpleadoDetalle | null
  transporte_id: number | null
  transporte: TransporteResumen | null
  seguimiento: SeguimientoResumen | null
  viaje_embarques: ViajeEmbarqueItem[]
  embarques: ViajeEmbarqueDatos[]
}

export interface ViajesFiltros {
  empleado_chofer_id?: number
  transporte_id?: number
  fecha_desde?: string
  fecha_hasta?: string
  page?: number
  per_page?: number
}

export interface ViajesMeta {
  total: number
  page: number
  per_page: number
  last_page: number
}

export interface ViajesRespuesta {
  data: Viaje[]
  meta: ViajesMeta
  msg: { code: string; msg: string }
}
