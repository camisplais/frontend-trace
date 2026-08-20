/**
 * Tipos del dominio de Customer Service (Cronograma / Historial).
 * Alineados al backend real (modulo embarques).
 */

export type TipoEmbarque = 'regular' | 'expeditado'

export const tipoEmbarqueLabel: Record<TipoEmbarque, string> = {
  regular: 'Regular',
  expeditado: 'Expeditado',
}

/** Cliente (subconjunto que usa el front). GET /clientes -> { data, meta } */
export interface Cliente {
  id: number
  nombre: string
  tipo: string
  ubicacion: string
}

/**
 * Datos de una fila ya parseada por el backend en el preview.
 * (POST /embarques/import/preview)
 */
export interface ImportEmbarqueDatos {
  plan_embarque: string
  fecha: string
  hora: string
  tipo: TipoEmbarque
  tarima: number
  cantidad_piezas: number
}

/** Cada fila del preview: puede traer datos validos o errores. */
export interface ImportEmbarqueRow {
  fila: number
  datos: ImportEmbarqueDatos | null
  errores: string[]
}

/** Respuesta del preview. */
export interface PreviewResponse {
  data: ImportEmbarqueRow[]
  msg: string | null
}

/** Item que espera el confirmar (POST /embarques/import/confirmar). */
export interface ConfirmarEmbarqueItem extends ImportEmbarqueDatos {
  cliente_id: number
}

/**
 * View-model de una fila del cronograma en la tabla:
 * los datos parseados + el cliente que asigna el CS.
 */
export interface CronogramaFila {
  fila: number
  datos: ImportEmbarqueDatos | null
  errores: string[]
  clienteId: number | null
}

/** Fila del Historial de planes de embarque (GET /embarques). */
export interface HistorialItem {
  id: number
  cliente: string
  planEmbarque: string
  tarimas: number
  piezas: number
  tipo: TipoEmbarque
}

/** Meta de paginacion que devuelve el backend. */
export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Embarque tal como lo devuelve GET /embarques (con cliente incluido). */
export interface EmbarqueCliente {
  id: number
  nombre: string
}

export interface Embarque {
  id: number
  cliente: EmbarqueCliente
  plan_embarque: string
  fecha: string
  hora: string
  tipo: TipoEmbarque
  tarima: number
  cantidad_piezas: number
  estado: string
}

/** Filtros de la pantalla de Historial. */
export interface HistorialFiltros {
  tipo?: TipoEmbarque
  fecha_desde?: string
  fecha_hasta?: string
  page?: number
  limit?: number
}

export interface EmbarquesRespuesta {
  data: Embarque[]
  meta: PaginatedMeta
}
