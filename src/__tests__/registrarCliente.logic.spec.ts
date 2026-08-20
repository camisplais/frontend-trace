import { describe, it, expect } from 'vitest'
import type { Documento } from '@/types/cliente'

// Replica la regla de pruebasNecesarias del composable useRegistrarCliente.
function pruebasNecesarias(
  documentos: Documento[],
  tipo: string,
): Set<number> {
  if (!tipo) return new Set()
  if (tipo === 'medico') return new Set(documentos.map((d) => d.id))
  return new Set(documentos.filter((d) => !d.soloMedico).map((d) => d.id))
}

const catalogo: Documento[] = [
  { id: 1, nombre: 'Factura', soloMedico: false, descripcion: null },
  { id: 2, nombre: 'Fotografía', soloMedico: false, descripcion: null },
  { id: 3, nombre: 'Certificado de conformidad', soloMedico: true, descripcion: null },
  { id: 4, nombre: 'Certificado de análisis', soloMedico: true, descripcion: null },
]

describe('pruebasNecesarias según tipo', () => {
  it('médico incluye todas las pruebas', () => {
    expect([...pruebasNecesarias(catalogo, 'medico')]).toEqual([1, 2, 3, 4])
  })

  it('otro tipo incluye solo las que no son soloMedico', () => {
    expect([...pruebasNecesarias(catalogo, 'automotriz')]).toEqual([1, 2])
  })

  it('sin tipo no marca ninguna', () => {
    expect(pruebasNecesarias(catalogo, '').size).toBe(0)
  })
})
