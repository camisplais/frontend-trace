export interface TransporteEnPlanta {
  id: number
  placas: string
  marca: string
  carga_util: string
  estado: string
}

export interface ChoferDisponible {
  id: number
  no_empleado: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string
  puesto: string
  departamento: string
  estado: string
}

export interface DocumentoRequerido {
  doc_cliente_id: number
  nombre: string
}

export interface CrearViajePayload {
  empleado_chofer_id: number
  transporte_id: number
  embarque_id: number
}
