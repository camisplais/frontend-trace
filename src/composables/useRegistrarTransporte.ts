import { ref, computed } from 'vue'
import { transportesService } from '@/services/transportes.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'

const TIPOS_IMAGEN = ['image/jpeg', 'image/png']
const MAX_IMAGEN_BYTES = 5 * 1024 * 1024 // 5MB (igual que el backend)

/** Deja solo dígitos y punto decimal (el backend espera un número en string). */
function soloNumero(valor: string): string {
  return valor.replace(/[^\d.]/g, '')
}

/**
 * Estado y lógica de "Registrar Transporte".
 * Valida en cliente lo mismo que el backend (tipo/tamaño de imagen, campos
 * obligatorios) para dar feedback inmediato; el backend sigue siendo la verdad.
 */
export function useRegistrarTransporte() {
  const marca = ref('')
  const placas = ref('')
  const cargaUtil = ref('')
  const imagen = ref<File | null>(null)
  const guardando = ref(false)

  const puedeRegistrar = computed(
    () =>
      marca.value.trim() !== '' &&
      placas.value.trim() !== '' &&
      soloNumero(cargaUtil.value) !== '',
  )

  /** Valida el archivo elegido; devuelve mensaje de error o null si es válido. */
  function validarImagen(file: File): string | null {
    if (!TIPOS_IMAGEN.includes(file.type)) {
      return 'El formato del archivo no es el correcto. Solo JPG o PNG.'
    }
    if (file.size > MAX_IMAGEN_BYTES) {
      return 'El archivo es demasiado grande. Máximo 5MB.'
    }
    return null
  }

  async function elegirImagen(file: File | null) {
    if (!file) {
      imagen.value = null
      return
    }
    const err = validarImagen(file)
    if (err) {
      imagen.value = null
      await alerta.errorCodigo('Revisa el formulario', err, 'FILE_001')
      return
    }
    imagen.value = file
  }

  async function registrar(): Promise<boolean> {
    if (!puedeRegistrar.value) return false
    guardando.value = true
    try {
      await transportesService.crear({
        marca: marca.value.trim(),
        placas: placas.value.trim(),
        carga_util: soloNumero(cargaUtil.value),
        imagen: imagen.value,
      })
      return true
    } catch (e) {
      if (e instanceof ApiError) {
        await alerta.errorCodigo('Revisa el formulario', e.message, e.code)
      } else {
        await alerta.error('No se pudo registrar', 'Ocurrió un error inesperado.')
      }
      return false
    } finally {
      guardando.value = false
    }
  }

  return {
    marca,
    placas,
    cargaUtil,
    imagen,
    guardando,
    puedeRegistrar,
    elegirImagen,
    registrar,
  }
}
