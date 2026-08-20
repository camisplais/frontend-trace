/**
 * Tipos del dominio de Clientes (CRUD de Customer Service).
 * Alineados al backend real (módulos clientes y documentos).
 */

export type TipoCliente = 'medico' | 'automotriz' | 'aeroespacial' | 'electrico'

export const tipoClienteLabel: Record<TipoCliente, string> = {
  medico: 'Médico',
  automotriz: 'Automotriz',
  aeroespacial: 'Aeroespacial',
  electrico: 'Eléctrico',
}

export const tiposCliente: TipoCliente[] = [
  'medico',
  'automotriz',
  'aeroespacial',
  'electrico',
]

/** Documento del catálogo (prueba de entrega). GET /documentos */
export interface Documento {
  id: number
  nombre: string
  descripcion: string | null
  soloMedico: boolean
}

/** Documento ya asignado a un cliente. */
export interface DocumentoAsignado {
  id: number
  nombre: string
}

export interface Cliente {
  id: number
  nombre: string
  tipo: TipoCliente
  ubicacion: string
  documentos?: DocumentoAsignado[]
}

/** Meta de paginación que devuelve GET /clientes. */
export interface ClientesMeta {
  total: number
  page: number
  per_page: number
  last_page: number
}

export interface ClientesRespuesta {
  data: Cliente[]
  meta: ClientesMeta
}

export interface ClientesFiltros {
  search?: string
  ciudad?: string
  tipo?: TipoCliente
  page?: number
  per_page?: number
}

/** Payload para crear cliente (las pruebas las asigna el backend por tipo). */
export interface CrearClientePayload {
  nombre: string
  tipo: TipoCliente
  ubicacion: string
}

/** Payload para editar cliente (solo el nombre es editable). */
export interface ActualizarClientePayload {
  nombre: string
}
