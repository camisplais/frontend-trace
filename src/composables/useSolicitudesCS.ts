import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { solicitudesService } from '@/services/solicitudes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { Solicitud } from '@/types/solicitud'

export type FiltroEstado = '' | 'pendiente' | 'aceptado' | 'rechazado'
export type FiltroTipo = '' | 'solicitarqr' | 'pe_desfasadas'

export function useSolicitudesCoordinador() {
  const auth = useAuthStore()

  const solicitudes = ref<Solicitud[]>([])
  const cargando = ref(false)
  const procesandoId = ref<number | null>(null)

  const filtroEstado = ref<FiltroEstado>('pendiente')
  const filtroTipo = ref<FiltroTipo>('')
  const filtroDias = ref<number | null>(30) // null = todas las fechas

  function mostrarError(e: unknown, tituloGenerico: string) {
    if (e instanceof ApiError) {
      alerta.error(tituloGenerico, `[${e.code}] ${e.message}`)
    } else {
      alerta.error(tituloGenerico, 'Ocurrió un error inesperado. Intenta de nuevo.')
    }
  }

  async function cargar() {
    if (!auth.user?.empleadoId) return
    cargando.value = true
    try {
      solicitudes.value = await solicitudesService.findAll({
        receptor: auth.user.empleadoId,
        estado: filtroEstado.value || undefined,
        tipo: filtroTipo.value || undefined,
      })
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar las solicitudes')
    } finally {
      cargando.value = false
    }
  }

  // Estado y tipo se resuelven en el backend -> recargar al cambiar
  watch([filtroEstado, filtroTipo], cargar)

  // La fecha se filtra en el cliente, sobre lo que ya se cargó
  const solicitudesFiltradas = computed(() => {
    if (filtroDias.value === null) return solicitudes.value
    const limite = Date.now() - filtroDias.value * 24 * 60 * 60 * 1000
    return solicitudes.value.filter((s) => new Date(s.createdAt).getTime() >= limite)
  })

  async function aceptar(id: number) {
    procesandoId.value = id
    try {
      await solicitudesService.aceptar(id)
      await cargar()
      await alerta.exito('Solicitud aceptada', 'Se notificó al emisor.')
    } catch (e) {
      mostrarError(e, 'No se pudo aceptar la solicitud')
    } finally {
      procesandoId.value = null
    }
  }

  async function rechazar(id: number) {
    procesandoId.value = id
    try {
      await solicitudesService.rechazar(id)
      await cargar()
      await alerta.exito('Solicitud rechazada', '')
    } catch (e) {
      mostrarError(e, 'No se pudo rechazar la solicitud')
    } finally {
      procesandoId.value = null
    }
  }

  return {
    solicitudesFiltradas, cargando, procesandoId,
    filtroEstado, filtroTipo, filtroDias,
    cargar, aceptar, rechazar,
  }
}
