/**
 * Tipos del dominio de Empleados (rol Coordinador de Stock).
 * Alineados al backend real (modulo `empleados`):
 *   - GET /empleados devuelve { data: Empleado[], meta } (paginado en servidor)
 *   - `imagen` llega como URL usable (el backend la prefirma) o null
 *   - `cuenta` es null mientras no se registre el usuario (pendiente)
 */

export type Departamento = 'supplychain' | 'transportes' | 'seguridad'

/** Etiqueta legible del departamento para la tabla. */
export const departamentoLabel: Record<Departamento, string> = {
  supplychain: 'Supply Chain',
  transportes: 'Transportes',
  seguridad: 'Seguridad',
}

export interface CuentaEmpleado {
  id: number
  username: string
}

export interface Empleado {
  id: number
  no_empleado: number
  nombre: string
  apellido_paterno: string
  apellido_materno: string | null
  fecha_nacimiento: string
  fecha_ingreso: string
  departamento: Departamento
  puesto: string
  estado: string | null
  /** URL usable de la foto, o null si no tiene. */
  imagen: string | null
  /** Cuenta asociada, o null si aun no se registra. */
  cuenta: CuentaEmpleado | null
}

/** Metadatos de paginacion que devuelve el backend. */
export interface EmpleadosMeta {
  total: number
  page: number
  per_page: number
  last_page: number
}

export interface EmpleadosRespuesta {
  data: Empleado[]
  meta: EmpleadosMeta
}

/** Nombre completo del empleado para mostrar en la tabla. */
export function nombreCompleto(empleado: Empleado): string {
  return [empleado.nombre, empleado.apellido_paterno, empleado.apellido_materno]
    .filter(Boolean)
    .join(' ')
}

/** Iniciales para el avatar cuando no hay foto. */
export function iniciales(empleado: Empleado): string {
  return `${empleado.nombre.charAt(0)}${empleado.apellido_paterno.charAt(0)}`.toUpperCase()
}
