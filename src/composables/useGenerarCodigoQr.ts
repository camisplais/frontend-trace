import { ref } from 'vue'
import { qrService } from '@/services/qr.service'
import { viajesService } from '@/services/viajes.service'
import { solicitudesService } from '@/services/solicitudes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { EmbarquePendiente } from '@/types/embarquePendiente'

export function useGenerarCodigoQr() {
  const generandoId = ref<number | null>(null)
  const solicitandoId = ref<number | null>(null)

  const modalAbierto = ref(false)
  const viajeIdModal = ref<number | null>(null)
  const embarquesPendientesModal = ref<EmbarquePendiente[]>([])

  function mostrarError(e: unknown, tituloGenerico: string) {
    if (e instanceof ApiError) {
      alerta.error(tituloGenerico, `[${e.code}] ${e.message}`)
    } else {
      alerta.error(tituloGenerico, 'Ocurrió un error inesperado. Intenta de nuevo.')
    }
  }

  async function iniciarGeneracion(viajeId: number) {
    generandoId.value = viajeId
    try {
      const pendientes = await viajesService.embarquesPendientes(viajeId)
       console.log('pendientes:', pendientes) 
      if (pendientes.length > 0) {
        viajeIdModal.value = viajeId
        embarquesPendientesModal.value = pendientes
        modalAbierto.value = true
        return
      }
      await generarQr(viajeId)
    } catch (e) {
      mostrarError(e, 'No se pudo validar el viaje')
    } finally {
      generandoId.value = null
    }
  }

  async function generarQr(viajeId: number) {
    try {
      await qrService.generarCodigo(viajeId)
      await alerta.exito('Código generado', 'El código QR se generó correctamente para el chofer.')
    } catch (e) {
      mostrarError(e, 'No se pudo generar el código')
    }
  }

  async function solicitarQrAlCoordinador() {
    const primerPendiente = embarquesPendientesModal.value[0]
    if (!viajeIdModal.value || !primerPendiente) return

    solicitandoId.value = viajeIdModal.value
    try {
      await solicitudesService.crear({
        viaje_embarque_id: primerPendiente.viaje_embarque_id,
        tipo: 'solicitarqr',
      })
      await alerta.exito('Solicitud enviada', 'Se notificó al Coordinador de Stock para autorizar el QR.')
      cerrarModal()
    } catch (e) {
      mostrarError(e, 'No se pudo enviar la solicitud')
    } finally {
      solicitandoId.value = null
    }
  }

  function cerrarModal() {
    modalAbierto.value = false
    viajeIdModal.value = null
    embarquesPendientesModal.value = []
  }

  return {
    generandoId, solicitandoId,
    modalAbierto, viajeIdModal, embarquesPendientesModal,
    iniciarGeneracion, solicitarQrAlCoordinador, cerrarModal,
  }
}
