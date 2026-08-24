export interface CrearSolicitudPayload {
  viaje_embarque_id: number
  tipo: 'solicitarqr' | 'pe_desfasadas'
}

export interface Solicitud {
  id: number
  viaje_embarque: { id: number; viaje: { id: number;} }
  tipo: string
  estado: string
  createdAt: string
  updatedAt: string
}

export type FiltrosSolicitudes = {
  tipo?:  string;
  estado?: string;
  receptor?: number;
}
