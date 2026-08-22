export interface Seguimimiento {
  id: number
  qr: string
  salida: string | null
  entrada: string | null
  viaje: { id: number }
}
