import { http } from '@/services/http'
import type {
  ImportEmbarqueRow,
  PreviewResponse,
  ConfirmarEmbarqueItem,
} from '@/types/embarque'

/**
 * Servicio de Cronograma (modulo embarques del backend).
 *
 * Flujo:
 *  1. subirPlan -> POST /embarques/import/preview  (parsea el archivo)
 *  2. confirmar -> POST /embarques/import/confirmar (persiste con cliente_id)
 */
export const cronogramaService = {
  /**
   * Sube el archivo del plan de embarque y devuelve las filas parseadas.
   * El campo del form-data debe llamarse `file` (lo espera el backend).
   */
  async subirPlan(archivo: File): Promise<ImportEmbarqueRow[]> {
    const form = new FormData()
    form.append('file', archivo)
    const res = await http.post<PreviewResponse>('/embarques/import/preview', { form })
    return res.data
  },

  /**
   * Confirma la importacion: crea los embarques con el cliente asignado.
   */
  async confirmar(embarques: ConfirmarEmbarqueItem[]): Promise<void> {
    await http.post('/embarques/import/confirmar', { body: { embarques } })
  },
}
