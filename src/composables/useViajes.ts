import { ref } from 'vue'
import { viajesService } from '@/services/viajes.service'
import { ApiError } from '@/services/http'
import type { Viaje } from '@/types/viajes'

export function useViajes() {
  const viajes = ref<Viaje[]>([])
  const page = ref(1)
  const totalPages = ref(1)
  const perPage = 5

  const cargando = ref(false)
  const error = ref<string | null>(null)

  async function cargar() {
    cargando.value = true
    error.value = null
    try {
      const resp = await viajesService.listar({ page: page.value, per_page: perPage })
      viajes.value = resp.data
      totalPages.value = resp.meta.last_page
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'No se pudieron cargar los viajes.'
    } finally {
      cargando.value = false
    }
  }

  function irAPagina(p: number) {
    page.value = p
    cargar()
  }

  return { viajes, page, totalPages, cargando, error, cargar, irAPagina }
}
