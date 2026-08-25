export interface CrearSolicitudPayload {
  viaje_embarque_id: number
  tipo: 'solicitarqr' | 'pe_desfasadas'
}

export interface Solicitud {
  id: number
  viaje_embarque: { id: number; viaje: { id: number;}, embarque: { id: number; plan_embarque: { id: string; } } }
  empleado_emisor: { id: number; nombre: string; apellido_paterno: string; apellido_materno: string }
  tipo: string
  estado: 'pendiente' | 'aceptado' | 'rechazada'
  createdAt: string
  updatedAt: string
}

export type FiltrosSolicitudes = {
  tipo?:  string;
  estado?: string;
  receptor?: number;
}
