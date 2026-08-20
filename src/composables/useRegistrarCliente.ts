import { ref, computed } from 'vue'
import { clientesService } from '@/services/clientes.service'
import { documentosService } from '@/services/documentos.service'
import { ApiError } from '@/services/http'
import type { Documento, TipoCliente } from '@/types/cliente'

/**
 * Estado y lógica de Registrar Cliente.
 *
 * Las "pruebas de entrega necesarias" no las elige el usuario: se derivan del
 * tipo de cliente (regla del backend: médico -> todas; otro tipo -> solo las
 * que no son `soloMedico`). Aquí solo las calculamos para mostrarlas.
 */
export function useRegistrarCliente() {
  const nombre = ref('')
  const ubicacion = ref('')
  const tipo = ref<TipoCliente | ''>('')

  const documentos = ref<Documento[]>([])
  const guardando = ref(false)
  const error = ref<string | null>(null)
  const exito = ref(false)

  async function cargarDocumentos() {
    try {
      documentos.value = await documentosService.listar()
    } catch (e) {
      error.value =
        e instanceof ApiError ? e.message : 'No se pudo cargar el catálogo de pruebas.'
    }
  }

  /** Ids de las pruebas que aplican según el tipo elegido. */
  const pruebasNecesarias = computed<Set<number>>(() => {
    if (!tipo.value) return new Set()
    if (tipo.value === 'medico') {
      return new Set(documentos.value.map((d) => d.id))
    }
    return new Set(documentos.value.filter((d) => !d.soloMedico).map((d) => d.id))
  })

  const puedeRegistrar = computed(
    () => nombre.value.trim() !== '' && ubicacion.value.trim() !== '' && tipo.value !== '',
  )

  async function registrar(): Promise<boolean> {
    if (!puedeRegistrar.value || tipo.value === '') return false
    guardando.value = true
    error.value = null
    exito.value = false
    try {
      await clientesService.crear({
        nombre: nombre.value.trim(),
        ubicacion: ubicacion.value.trim(),
        tipo: tipo.value,
      })
      exito.value = true
      return true
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudo registrar el cliente.'
      return false
    } finally {
      guardando.value = false
    }
  }

  return {
    nombre,
    ubicacion,
    tipo,
    documentos,
    guardando,
    error,
    exito,
    pruebasNecesarias,
    puedeRegistrar,
    cargarDocumentos,
    registrar,
  }
}
