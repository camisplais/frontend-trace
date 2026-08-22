/**
 * Tipos del dominio de Cuentas de usuario (alta y edicion desde Empleados).
 *
 * Backend real (modulo `usuarios`):
 *   - POST  /usuarios/empleado/:empleadoId          -> crear cuenta
 *   - PATCH /usuarios/empleado/:empleadoId          -> username y/o celular
 *   - PATCH /usuarios/empleado/:empleadoId/password -> solo contrasena
 *   - GET   /usuarios/:id                           -> detalle (trae celular)
 */

import type { Empleado } from '@/types/empleado'

export interface Rol {
  id: number
  nombre: string
}

/** Lo que devuelve `toResponse` del backend. */
export interface Usuario {
  id: number
  rol_id: number | null
  rol: Rol | null
  empleado_id: number | null
  username: string
  celular: string
  estado: boolean
}

/** Limpia acentos y deja solo a-z, igual que `limpiarTexto` del backend. */
function limpiarTexto(texto: string): string {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
}

/**
 * Reproduce la regla de username del backend: inicial del nombre + los
 * primeros 7 caracteres de los apellidos, rellenando con 'x' hasta 8.
 *
 * El backend rechaza con VAL_010 cualquier username que no sea exactamente
 * este, asi que el modal lo muestra ya calculado y en solo lectura en vez de
 * dejar que el coordinador lo teclee y falle.
 */
export function usernameSugerido(empleado: Empleado): string {
  const inicial = limpiarTexto(empleado.nombre).charAt(0)
  const apellidos =
    limpiarTexto(empleado.apellido_paterno) +
    limpiarTexto(empleado.apellido_materno ?? '')
  return (inicial + apellidos.substring(0, 7)).padEnd(8, 'x')
}

/** Minimo 8 caracteres, una mayuscula y un caracter especial (VAL_002/VAL_003). */
export function validarPassword(password: string): string | null {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[A-Z]/.test(password)) return 'La contraseña debe incluir al menos una mayúscula.'
  if (!/[^a-zA-Z0-9]/.test(password))
    return 'La contraseña debe incluir al menos un carácter especial.'
  return null
}

/** Hasta 10 digitos, solo numeros (VAL_009). */
export function validarCelular(celular: string): string | null {
  if (!/^\d{1,10}$/.test(celular)) return 'El celular debe tener máximo 10 dígitos numéricos.'
  return null
}
