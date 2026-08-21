/**
 * Tipos del dominio de Transportes (CRUD del Coordinador de Stock).
 * Alineados al backend real (módulo `transportes`):
 *   - entidad: placas, marca, carga_util, imagen, estado
 *   - estado es un enum: 'viaje' | 'planta'
 *   - crear/editar viajan como multipart/form-data (la imagen es un archivo)
 */

/** Estado de la unidad tal como lo guarda el backend. */
export type EstadoTransporte = 'planta' | 'viaje'

/**
 * En la UI el estado se muestra en lenguaje de negocio:
 *   planta -> "En planta"  (disponible)
 *   viaje  -> "Fuera de planta" (en viaje)
 */
export const estadoTransporteLabel: Record<EstadoTransporte, string> = {
  planta: 'En planta',
  viaje: 'Fuera de planta',
}

export const estadosTransporte: EstadoTransporte[] = ['planta', 'viaje']

export interface Transporte {
  id: number
  marca: string
  placas: string
  /** Decimal serializado como string por el backend (ej. "6000.00"). */
  carga_util: string
  /** Clave/URL de la imagen en el storage. `null` si no tiene. */
  imagen: string | null
  estado: EstadoTransporte
}

/** Filtro de la pantalla de Transportes. `''` = todos. */
export interface TransportesFiltros {
  estado?: EstadoTransporte
}

/**
 * Payload para registrar. La imagen es opcional y se manda como archivo,
 * por eso el servicio arma el FormData (no se serializa aquí).
 */
export interface CrearTransportePayload {
  marca: string
  placas: string
  /** Numérico en string (backend valida IsNumberString). Ej. "6000". */
  carga_util: string
  imagen?: File | null
}

/**
 * Payload para editar. Según el diseño (EDITAR TRANSPORTE) solo la placa y la
 * imagen son editables; el resto de campos se muestran de solo lectura.
 */
export interface ActualizarTransportePayload {
  placas?: string
  imagen?: File | null
}
