import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmbarquesTabla from '@/components/historial/EmbarquesTabla.vue'
import type { Embarque } from '@/types/embarque'

const embarque: Embarque = {
  id: 1,
  cliente: { id: 2, nombre: 'Rotax' },
  plan_embarque: 'EM-001',
  fecha: '2026-06-25',
  hora: '09:30:00',
  tipo: 'regular',
  tarima: 3,
  cantidad_piezas: 1450,
  estado: 'activo',
}

describe('EmbarquesTabla', () => {
  it('numera según el índice inicial y formatea piezas', () => {
    const wrapper = mount(EmbarquesTabla, {
      props: { embarques: [embarque], indiceInicial: 6 },
    })
    expect(wrapper.text()).toContain('6')
    expect(wrapper.text()).toContain('1,450')
    expect(wrapper.text()).toContain('Rotax')
  })

  it('emite ver con el embarque al pulsar el ojo', async () => {
    const wrapper = mount(EmbarquesTabla, {
      props: { embarques: [embarque], indiceInicial: 1 },
    })
    await wrapper.find('.ojo').trigger('click')
    expect(wrapper.emitted('ver')?.[0]).toEqual([embarque])
  })

  it('muestra estado vacío cuando no hay filas', () => {
    const wrapper = mount(EmbarquesTabla, {
      props: { embarques: [], indiceInicial: 1, cargando: false },
    })
    expect(wrapper.text()).toContain('No hay embarques para mostrar')
  })
})
