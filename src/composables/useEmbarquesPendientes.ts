import { ref, computed } from 'vue'
import { pruebaEntregaService } from '@/services/pruebaEntrega.service'
import { solicitudesService } from '@/services/solicitudes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { EmbarquePendienteGlobal } from '@/types/embarquePendienteGlobal'
import type { Solicitud } from '@/types/solicitud'
import type { DocsFaltantesEmbarque } from '@/types/documentoFaltante'

export type EstadoFila = 'sin_solicitud' | 'pendiente' | 'aceptado' | null

export function useEmbarquesPendientes() {
  const pendientes = ref<EmbarquePendienteGlobal[]>([])
  const solicitudes = ref<Solicitud[]>([])
  const cargando = ref(false)
  const solicitandoId = ref<number | null>(null)
  const filtroClienteId = ref<number | null>(null)

  const modalAbierto = ref(false)
  const itemModal = ref<EmbarquePendienteGlobal | null>(null)
  const docsFaltantes = ref<DocsFaltantesEmbarque | null>(null)
  const cargandoDocs = ref(false)
  const archivosPorDoc = ref<Record<number, File | null>>({})
  const subidoPorDoc = ref<Record<number, boolean>>({})
  const subiendoPorDoc = ref<Record<number, boolean>>({})

  const clientesDisponibles = computed(() => {
    const mapa = new Map<number, string>()
    pendientes.value.forEach((item) => {
      mapa.set(item.embarque.cliente.id, item.embarque.cliente.nombre)
    })
    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }))
  })

  const pendientesFiltrados = computed(() => {
    if (filtroClienteId.value === null) return pendientes.value
    return pendientes.value.filter((item) => item.embarque.cliente.id === filtroClienteId.value)
  })

  function mostrarError(e: unknown, tituloGenerico: string) {
    if (e instanceof ApiError) {
      alerta.error(tituloGenerico, `[${e.code}] ${e.message}`)
    } else {
      alerta.error(tituloGenerico, 'Ocurrió un error inesperado. Intenta de nuevo.')
    }
  }

  async function cargar() {
    cargando.value = true
    try {
      const [p, s] = await Promise.all([
        pruebaEntregaService.embarquesPendientesGlobal(),
        solicitudesService.findAll({ tipo: 'pe_desfasadas' }),
      ])
      pendientes.value = p
      solicitudes.value = s
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar los embarques pendientes')
    } finally {
      cargando.value = false
    }
  }

  function estadoFila(item: EmbarquePendienteGlobal): EstadoFila {
    if (item.viaje_embarque_id === null) return null
    const solicitud = solicitudes.value.find((s) => s.viaje_embarque.id === item.viaje_embarque_id)
    if (!solicitud) return 'sin_solicitud'
    if (solicitud.estado === 'pendiente') return 'pendiente'
    if (solicitud.estado === 'aceptado') return 'aceptado'
    return 'sin_solicitud' // rechazado -> se puede volver a solicitar
  }

  async function solicitar(item: EmbarquePendienteGlobal) {
    if (!item.viaje_embarque_id) return
    solicitandoId.value = item.viaje_embarque_id
    try {
      const nueva = await solicitudesService.crear({
        viaje_embarque_id: item.viaje_embarque_id,
        tipo: 'pe_desfasadas',
      })
      solicitudes.value.push(nueva)
      await alerta.exito('Solicitud enviada', 'Se notificó al Coordinador de Stock.')
    } catch (e) {
      mostrarError(e, 'No se pudo enviar la solicitud')
    } finally {
      solicitandoId.value = null
    }
  }

  async function abrirModalSubir(item: EmbarquePendienteGlobal) {
    itemModal.value = item
    modalAbierto.value = true
    archivosPorDoc.value = {}
    subidoPorDoc.value = {}
    cargandoDocs.value = true
    try {
      docsFaltantes.value = await pruebaEntregaService.docsFaltantes(item.embarque.id)
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar los documentos faltantes')
    } finally {
      cargandoDocs.value = false
    }
  }

  function elegirArchivo(docClienteId: number, file: File | null) {
    archivosPorDoc.value[docClienteId] = file
  }

  async function subirDocumento(docClienteId: number) {
    const file = archivosPorDoc.value[docClienteId]
    const item = itemModal.value
    const viajeId = item?.viaje_id
    if (!file) {
    alerta.error('Falta un archivo', 'Selecciona un archivo antes de subir.')
    return
    }
    if (!item || viajeId == null) {
      alerta.error('Viaje no encontrado', 'Este embarque no tiene un viaje asignado.')
      return
    }
    subiendoPorDoc.value[docClienteId] = true
    try {
      await pruebaEntregaService.subirPruebaDesfasada(
        viajeId,
        item.embarque.id,
        docClienteId,
        file,
      )
      subidoPorDoc.value[docClienteId] = true
    } catch (e) {
      mostrarError(e, 'No se pudo subir el documento')
    } finally {
      subiendoPorDoc.value[docClienteId] = false
    }
  }

  function cerrarModal() {
    modalAbierto.value = false
    itemModal.value = null
    docsFaltantes.value = null
  }

  return {
    pendientes, cargando, solicitandoId,
    modalAbierto, itemModal, docsFaltantes, cargandoDocs,
    archivosPorDoc, subidoPorDoc, subiendoPorDoc,
    cargar, estadoFila, solicitar, abrirModalSubir, elegirArchivo, subirDocumento, cerrarModal,pendientesFiltrados, filtroClienteId, clientesDisponibles
  }
}
