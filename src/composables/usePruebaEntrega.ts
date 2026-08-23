import { ref } from 'vue'
import { pruebaEntregaService } from '@/services/pruebaEntrega.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'
import type { DocumentoEntrega, FiltroPruebas } from '@/types/pruebaEntrega'
import type { Cliente } from '@/types/embarque'

export function usePruebasEntrega() {
  const clienteSeleccionado = ref<Cliente | null>(null)
  const documentos = ref<DocumentoEntrega[]>([])
  const page = ref(1)
  const totalPages = ref(1)
  const limit = 10

  const filtros = ref<{ search: string; tipo: string; fechaInicio: string; fechaFin: string }>({
    search: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
  })

  const cargando = ref(false)

  function entrarACliente(cliente: Cliente) {
    clienteSeleccionado.value = cliente
    page.value = 1
    cargarDocumentos()
  }

  function volverAClientes() {
    clienteSeleccionado.value = null
    documentos.value = []
  }

  async function cargarDocumentos() {
    if (!clienteSeleccionado.value) return
    cargando.value = true
    try {
      const f: FiltroPruebas = {
        cliente_id: clienteSeleccionado.value.id,
        page: page.value,
        limit,
      }
      if (filtros.value.search) f.search = filtros.value.search
      if (filtros.value.tipo) f.tipo = filtros.value.tipo
      if (filtros.value.fechaInicio) f.fecha_inicio = filtros.value.fechaInicio
      if (filtros.value.fechaFin) f.fecha_fin = filtros.value.fechaFin

      const resp = await pruebaEntregaService.listarDocumentos(f)
      documentos.value = resp.data
      totalPages.value = resp.meta.totalPages
    } catch (e) {
      if (e instanceof ApiError) alerta.error(e.code, e.message)
      else alerta.error('Error', 'No se pudieron cargar los documentos.')
    } finally {
      cargando.value = false
    }
  }

  function aplicarFiltros() {
    page.value = 1
    cargarDocumentos()
  }

  function irAPagina(p: number) {
    page.value = p
    cargarDocumentos()
  }

  async function abrirDocumento(id: number) {
    try {
      const url = await pruebaEntregaService.obtenerUrl(id)
      window.open(url, '_blank')
    } catch (e) {
      if (e instanceof ApiError) alerta.error(e.code, e.message)
      else alerta.error('Error', 'No se pudo abrir el documento.')
    }
  }

  return {
    clienteSeleccionado, documentos, page, totalPages, filtros, cargando,
    entrarACliente, volverAClientes, cargarDocumentos, aplicarFiltros, irAPagina, abrirDocumento,
  }
}
