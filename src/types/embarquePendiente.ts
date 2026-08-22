import type { Embarque } from '@/types/embarque'

export interface EmbarquePendiente {
  viaje_embarque_id: number
  embarque: Embarque
  total_requeridos: number
  total_subidos: number
  pendientes: boolean
}
