import { describe, it, expect } from 'vitest'
import type { CronogramaFila, ImportEmbarqueDatos } from '@/types/embarque'

// Replica la regla de "puedeGuardar" de la vista para probarla aislada.
function puedeGuardar(filas: CronogramaFila[]): boolean {
  const validas = filas.filter((f) => f.datos !== null)
  return validas.length > 0 && validas.every((f) => f.clienteId !== null)
}

const datos: ImportEmbarqueDatos = {
  plan_embarque: 'EM-001',
  fecha: '2026-06-25',
  hora: '09:30',
  tipo: 'regular',
  tarima: 4,
  cantidad_piezas: 120,
}

describe('cronograma · puedeGuardar', () => {
  it('bloquea si una fila válida no tiene cliente', () => {
    const filas: CronogramaFila[] = [{ fila: 2, datos, errores: [], clienteId: null }]
    expect(puedeGuardar(filas)).toBe(false)
  })

  it('permite si todas las filas válidas tienen cliente', () => {
    const filas: CronogramaFila[] = [{ fila: 2, datos, errores: [], clienteId: 1 }]
    expect(puedeGuardar(filas)).toBe(true)
  })

  it('ignora filas con error pero exige cliente en las válidas', () => {
    const filas: CronogramaFila[] = [
      { fila: 2, datos, errores: [], clienteId: 3 },
      { fila: 3, datos: null, errores: ['tipo inválido'], clienteId: null },
    ]
    expect(puedeGuardar(filas)).toBe(true)
  })

  it('bloquea si no hay ninguna fila válida', () => {
    const filas: CronogramaFila[] = [
      { fila: 2, datos: null, errores: ['fecha es obligatoria'], clienteId: null },
    ]
    expect(puedeGuardar(filas)).toBe(false)
  })
})
