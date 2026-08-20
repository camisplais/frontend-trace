import { ref, computed } from 'vue'
import { cronogramaService } from '@/services/cronograma.service'
import { clientesService } from '@/services/clientes.service'
import { alerta } from '@/services/alerta'
import { ApiError } from '@/services/http'
import type { Cliente, CronogramaFila, ConfirmarEmbarqueItem } from '@/types/embarque'

/**
 * Encapsula el estado y la lógica del Cronograma: carga de clientes, preview
 * del archivo, validación de filas y confirmación. La vista solo orquesta.
 */
export function useCronograma() {
  const filas = ref<CronogramaFila[]>([])
  const clientes = ref<Cliente[]>([])
  const cronogramaCargado = ref(false)

  const archivo = ref<File | null>(null)
  const subiendo = ref(false)
  const guardando = ref(false)


  async function cargarClientes() {
    try {
      clientes.value = await clientesService.listar()
    } catch {
      await alerta.error(
        'No se pudieron cargar los clientes',
        'Revisa que el backend esté corriendo.',
      )
    }
  }

  function elegirArchivo(file: File | null) {
    archivo.value = file
  }

  async function subir() {
    if (!archivo.value) return
    subiendo.value = true
    try {
      const rows = await cronogramaService.subirPlan(archivo.value)
      filas.value = rows.map((row) => ({
        fila: row.fila,
        datos: row.datos,
        errores: row.errores,
        clienteId: null,
      }))
      cronogramaCargado.value = true
      return true
    } catch (e) {
      await alerta.error(
        'No se pudo procesar el archivo',
        e instanceof ApiError ? e.message : undefined,
      )
      return false
    } finally {
      subiendo.value = false
    }
  }

  const filasValidas = computed(() => filas.value.filter((f) => f.datos !== null))
  const hayFilasConError = computed(() => filas.value.some((f) => f.datos === null))
  const puedeGuardar = computed(
    () =>
      filasValidas.value.length > 0 &&
      filasValidas.value.every((f) => f.clienteId !== null),
  )

  async function guardar() {
    if (!puedeGuardar.value) return
    guardando.value = true
    try {
      const payload: ConfirmarEmbarqueItem[] = filasValidas.value.map((f) => ({
        cliente_id: f.clienteId as number,
        plan_embarque: f.datos!.plan_embarque,
        fecha: f.datos!.fecha,
        hora: f.datos!.hora,
        tipo: f.datos!.tipo,
        tarima: f.datos!.tarima,
        cantidad_piezas: f.datos!.cantidad_piezas,
      }))
      await cronogramaService.confirmar(payload)
      await alerta.exito('¡Cronograma guardado!', 'La información se guardó correctamente.')
    } catch (e) {
      await alerta.error(
        'No se pudo guardar el cronograma',
        e instanceof ApiError ? e.message : undefined,
      )
    } finally {
      guardando.value = false
    }
  }

  return {
    filas,
    clientes,
    cronogramaCargado,
    archivo,
    subiendo,
    guardando,
    hayFilasConError,
    puedeGuardar,
    cargarClientes,
    elegirArchivo,
    subir,
    guardar,
  }
}
