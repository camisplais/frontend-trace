import { ref, watch, onMounted } from 'vue'
import { crearViajeService } from '@/services/crearViaje.service'
import { viajesService } from '@/services/viajes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { DocumentoRequerido } from '@/types/crearViaje'
import type { Embarque } from '@/types/embarque'
import type { Viaje } from '@/types/viajes'

export function useAgregarEmbarque(viajeId: number) {
  const viaje = ref<Viaje | null>(null)
  const embarques = ref<Embarque[]>([])
  const embarqueId = ref<number | null>(null)

  const documentos = ref<DocumentoRequerido[]>([])
  const archivosPorDoc = ref<Record<number, File | null>>({})
  const subidoPorDoc = ref<Record<number, boolean>>({})

  const cargando = ref(false)
  const cargandoDocs = ref(false)
  const enviando = ref(false)

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
      const [viajeRes, embarquesRes] = await Promise.all([
        viajesService.obtenerDetalle(viajeId),
        crearViajeService.embarquesDeHoy(), // ya trae sin_viaje: true
      ])
      viaje.value = viajeRes
      embarques.value = embarquesRes.data
    } catch (e) {
      mostrarError(e, 'No se pudo cargar la información del viaje')
    } finally {
      cargando.value = false
    }
  }

  onMounted(cargar)

  watch(embarqueId, async (id) => {
    documentos.value = []
    archivosPorDoc.value = {}
    subidoPorDoc.value = {}
    if (!id) return

    cargandoDocs.value = true
    try {
      documentos.value = await crearViajeService.documentosRequeridos(id)
    } catch (e) {
      mostrarError(e, 'No se pudieron cargar los documentos')
    } finally {
      cargandoDocs.value = false
    }
  })

  function elegirArchivo(docClienteId: number, file: File | null) {
    archivosPorDoc.value[docClienteId] = file
  }

  async function subirDocumento(docClienteId: number) {
    const file = archivosPorDoc.value[docClienteId]
    if (!file || !embarqueId.value) {
      alerta.error('Falta un archivo', 'Selecciona un archivo antes de subir.')
      return
    }
    try {
      await crearViajeService.subirDocumento(embarqueId.value, docClienteId, file)
      subidoPorDoc.value[docClienteId] = true
    } catch (e) {
      mostrarError(e, 'No se pudo subir el documento')
    }
  }

  async function agregar(): Promise<boolean> {
    if (!embarqueId.value) {
      alerta.error('Falta el embarque', 'Selecciona un embarque para agregar.')
      return false
    }
    enviando.value = true
    try {
      await viajesService.agregarEmbarque(viajeId, embarqueId.value)
      await alerta.exito('Embarque agregado', 'El embarque se agregó correctamente al viaje.')
      return true
    } catch (e) {
      mostrarError(e, 'No se pudo agregar el embarque')
      return false
    } finally {
      enviando.value = false
    }
  }

  return {
    viaje, embarques, embarqueId,
    documentos, archivosPorDoc, subidoPorDoc,
    cargando, cargandoDocs, enviando,
    elegirArchivo, subirDocumento, agregar,
  }
}
