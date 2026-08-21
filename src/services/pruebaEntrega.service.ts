import { http } from '@/services/http'

export interface PruebaEntrega {
  id: number
  documento_nombre: string
  url: string
  createdAt: string
}

export const pruebaEntregaService = {
  async porEmbarque(embarqueId: number): Promise<PruebaEntrega[]> {
    const res = await http.get<{ data: PruebaEntrega[]; msg: unknown }>(
      `/prueba-entrega-embarque/embarque/${embarqueId}`,
    )
    return res.data
  },
}
