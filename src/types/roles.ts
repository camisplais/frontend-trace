/**
 * Roles del sistema (Matriz de Roles y Funciones).
 */
export const Role = {
  CUSTOMER_SERVICE: 'customer_service',
  EMBARQUES: 'embarques',
  ADUANAS: 'aduanas',
  COORD_STOCK: 'coord_stock',
  CHOFER: 'chofer',
  CASETA: 'caseta',
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

export interface CurrentUser {
  id: number
  nombre: string
  role: Role
}
