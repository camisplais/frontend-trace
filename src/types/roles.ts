export const Role = {
  CUSTOMER_SERVICE: 'Customer Service',
  EMBARQUES: 'Embarques',
  ADUANAS: 'Aduanas',
  COORD_STOCK: 'Coordinador Stock',
  CHOFER: 'Chofer',
  CASETA: 'Caseta',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const roleLabel: Record<Role, string> = {
  [Role.CUSTOMER_SERVICE]: 'Customer Service',
  [Role.EMBARQUES]: 'Embarques',
  [Role.ADUANAS]: 'Aduanas',
  [Role.COORD_STOCK]: 'Coord. de Stock',
  [Role.CHOFER]: 'Chofer',
  [Role.CASETA]: 'Caseta',
}

export interface UsuarioApi {
  id: number
  rol_id: number | null
  rol: { id: number; nombre: string } | null
  empleado_id: number | null
  empleado: {
    id: number
    no_empleado: string
    nombre: string
    apellido_paterno: string
    apellido_materno: string
    fecha_nacimiento: string
    fecha_ingreso: string
    imagen: string | null
    departamento: unknown
    puesto: unknown
    estado: unknown
  } | null
  username: string
  celular: string | null
  estado: boolean
}

export interface CurrentUser {
  id: number
  empleadoId: number | null
  nombre: string
  role: Role
}
