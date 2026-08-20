import { ref, computed } from 'vue'
import { historialService } from '@/services/historial.service'
import { ApiError } from '@/services/http'
import type { Embarque } from '@/types/embarque'

export function useHorario() {
  const embarques = ref<Embarque[]>([])
  const busqueda = ref('')
  const page = ref(1)
  const totalPages = ref(1)
  const limit = 5

  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar() {
    cargando.value = true
    error.value = null
    try {
      // Sin fecha_desde/fecha_hasta: el backend ya filtra "hoy" por defecto
      const resp = await historialService.listar({
        page: page.value,
        limit,
      })
      embarques.value = resp.data
      totalPages.value = resp.meta.totalPages
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar los embarques.'
    } finally {
      cargando.value = false
    }
  }

  const embarquesFiltrados = computed(() => {
    const q = busqueda.value.trim().toLowerCase()
    if (!q) return embarques.value
    return embarques.value.filter((e) => e.cliente.nombre.toLowerCase().includes(q))
  })

  function irAPagina(p: number) {
    page.value = p
    cargar()
  }

  return { embarques: embarquesFiltrados, busqueda, page, totalPages, cargando, error, cargar, irAPagina }
}
