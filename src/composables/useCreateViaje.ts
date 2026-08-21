import { ref, watch } from 'vue'
import { crearViajeService } from '@/services/crearViaje.service'
import { ApiError } from '@/services/http'
import type { TransporteEnPlanta, ChoferDisponible, DocumentoRequerido } from '@/types/crearViaje'
import type { Embarque } from '@/types/embarque'

export function useCrearViaje() {
  // Opciones de los selects
  const transportes = ref<TransporteEnPlanta[]>([])
  const choferes = ref<ChoferDisponible[]>([])
  const embarques = ref<Embarque[]>([])

  // Selección del formulario
  const embarqueId = ref<number | null>(null)
  const transporteId = ref<number | null>(null)
  const choferId = ref<number | null>(null)
  const hora = ref('')

  // Documentos del embarque elegido
  const documentos = ref<DocumentoRequerido[]>([])
  const archivosPorDoc = ref<Record<number, File | null>>({})
  const subidoPorDoc = ref<Record<number, boolean>>({})

  const cargandoOpciones = ref(false)
  const cargandoDocs = ref(false)
  const enviando = ref(false)
  const error = ref<string | null>(null)

  async function cargarOpciones() {
    cargandoOpciones.value = true
    error.value = null
    try {
      const [tRes, cRes, eRes] = await Promise.all([
        crearViajeService.transportesEnPlanta(),
        crearViajeService.choferesDisponibles(),
        crearViajeService.embarquesDeHoy(),
      ])
      transportes.value = tRes.data
      choferes.value = cRes.data
      embarques.value = eRes.data
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar las opciones.'
    } finally {
      cargandoOpciones.value = false
    }
  }

  // Cuando cambia el embarque elegido, recarga sus documentos requeridos
  watch(embarqueId, async (id) => {
    documentos.value = []
    archivosPorDoc.value = {}
    subidoPorDoc.value = {}
    if (!id) return

    cargandoDocs.value = true
    try {
      documentos.value = await crearViajeService.documentosRequeridos(id)
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar los documentos.'
    } finally {
      cargandoDocs.value = false
    }
  })

  function elegirArchivo(docClienteId: number, file: File | null) {
    archivosPorDoc.value[docClienteId] = file
  }

  async function subirDocumento(docClienteId: number) {
    const file = archivosPorDoc.value[docClienteId]
    if (!file || !embarqueId.value) return
    try {
      await crearViajeService.subirDocumento(embarqueId.value, docClienteId, file)
      subidoPorDoc.value[docClienteId] = true
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudo subir el documento.'
    }
  }

  async function generarViaje(): Promise<boolean> {
    if (!embarqueId.value || !transporteId.value || !choferId.value) {
      error.value = 'Completa embarque, transporte y chofer.'
      return false
    }
    enviando.value = true
    error.value = null
    try {
      await crearViajeService.crear({
        embarque_id: embarqueId.value,
        transporte_id: transporteId.value,
        empleado_chofer_id: choferId.value,
      })
      return true
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudo crear el viaje.'
      return false
    } finally {
      enviando.value = false
    }
  }

  return {
    transportes, choferes, embarques,
    embarqueId, transporteId, choferId, hora,
    documentos, archivosPorDoc, subidoPorDoc,
    cargandoOpciones, cargandoDocs, enviando, error,
    cargarOpciones, elegirArchivo, subirDocumento, generarViaje,
  }
}
