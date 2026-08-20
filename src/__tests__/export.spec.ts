import { describe, it, expect } from 'vitest'
import { construirCsv } from '@/services/export'

describe('construirCsv', () => {
  it('arma encabezado y filas separadas por saltos de línea', () => {
    const csv = construirCsv(['Cliente', 'Plan'], [['Rotax', 'EM-001']])
    expect(csv).toBe('Cliente,Plan\nRotax,EM-001')
  })

  it('escapa valores con comas y comillas', () => {
    const csv = construirCsv(['Cliente'], [['Rotax, S.A.'], ['Dijo "hola"']])
    expect(csv).toContain('"Rotax, S.A."')
    expect(csv).toContain('"Dijo ""hola"""')
  })
})
