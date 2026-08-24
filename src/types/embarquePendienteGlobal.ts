import type { Embarque } from '@/types/embarque'

export interface EmbarquePendienteGlobal {
  viaje_embarque_id: number | null
  viaje_id: number | null
  embarque: Embarque
  total_requeridos: number
  total_subidos: number
  pendientes: boolean
}
