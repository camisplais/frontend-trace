import { ref } from 'vue'
import { qrService } from '@/services/qr.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'

export function useGenerarCodigoQr() {
  const generandoId = ref<number | null>(null)

  async function generarCodigo(viajeId: number) {
    generandoId.value = viajeId
    try {
      await qrService.generarCodigo(viajeId)
      await alerta.exito('Código generado', 'El código QR se generó correctamente para el chofer.')
    } catch (e) {
      if (e instanceof ApiError) {
        alerta.error('No se pudo generar el código', `[${e.code}] ${e.message}`)
      } else {
        alerta.error('No se pudo generar el código', 'Ocurrió un error inesperado. Intenta de nuevo.')
      }
    } finally {
      generandoId.value = null
    }
  }

  return { generandoId, generarCodigo }
}
