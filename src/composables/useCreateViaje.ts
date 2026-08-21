import { ref, watch } from 'vue'
import { crearViajeService } from '@/services/crearViaje.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { TransporteEnPlanta, ChoferDisponible, DocumentoRequerido } from '@/types/crearViaje'
import type { Embarque } from '@/types/embarque'

export function useCrearViaje() {
  const transportes = ref<TransporteEnPlanta[]>([])
  const choferes = ref<ChoferDisponible[]>([])
  const embarques = ref<Embarque[]>([])

  const embarqueId = ref<number | null>(null)
  const transporteId = ref<number | null>(null)
  const choferId = ref<number | null>(null)
  const hora = ref('')

  const documentos = ref<DocumentoRequerido[]>([])
  const archivosPorDoc = ref<Record<number, File | null>>({})
  const subidoPorDoc = ref<Record<number, boolean>>({})

  const cargandoOpciones = ref(false)
  const cargandoDocs = ref(false)
  const enviando = ref(false)

  // Muestra el error con SweetAlert, usando el code+mensaje real del backend
  // cuando existe, o un mensaje genérico si fue un fallo inesperado (red caída, etc.)
  function mostrarError(e: unknown, tituloGenerico: string) {
  if (e instanceof ApiError) {
    alerta.error(tituloGenerico, `[${e.code}] ${e.message}`)
  } else {
    alerta.error(tituloGenerico, 'Ocurrió un error inesperado. Intenta de nuevo.')
  }
}

  async function cargarOpciones() {
    cargandoOpciones.value = true
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
      mostrarError(e, 'No se pudieron cargar las opciones')
    } finally {
      cargandoOpciones.value = false
    }
  }

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

  watch(embarqueId, (id) => {
    const seleccionado = embarques.value.find((e) => e.id === id)
    hora.value = seleccionado?.hora ? seleccionado.hora.slice(0, 5) : ''
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

  async function generarViaje(): Promise<boolean> {
    if (!embarqueId.value || !transporteId.value || !choferId.value) {
      alerta.error('Campos incompletos', 'Completa embarque, transporte y chofer.')
      return false
    }
    enviando.value = true
    try {
      await crearViajeService.crear({
        embarque_id: embarqueId.value,
        transporte_id: transporteId.value,
        empleado_chofer_id: choferId.value,
      })
      await alerta.exito('Viaje creado', 'El viaje se generó correctamente.')
      return true
    } catch (e) {
      mostrarError(e, 'No se pudo crear el viaje')
      return false
    } finally {
      enviando.value = false
    }
  }

  return {
    transportes, choferes, embarques,
    embarqueId, transporteId, choferId, hora,
    documentos, archivosPorDoc, subidoPorDoc,
    cargandoOpciones, cargandoDocs, enviando,
    cargarOpciones, elegirArchivo, subirDocumento, generarViaje,
  }
}
