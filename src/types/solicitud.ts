export interface CrearSolicitudPayload {
  viaje_embarque_id: number
  tipo: 'solicitarqr'
}

export interface Solicitud {
  id: number
  tipo: string
  estado: string
  createdAt: string
  updatedAt: string
}
