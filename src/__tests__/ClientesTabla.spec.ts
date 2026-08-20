import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ClientesTabla from '@/components/clientes/ClientesTabla.vue'
import type { Cliente } from '@/types/cliente'

const cliente: Cliente = { id: 3, nombre: 'SYA', tipo: 'automotriz', ubicacion: 'Torreón' }

describe('ClientesTabla', () => {
  it('muestra el tipo con etiqueta legible y numera con índice inicial', () => {
    const wrapper = mount(ClientesTabla, {
      props: { clientes: [cliente], indiceInicial: 3 },
    })
    expect(wrapper.text()).toContain('Automotriz')
    expect(wrapper.text()).toContain('Torreón')
    expect(wrapper.text()).toContain('3')
  })

  it('emite editar y eliminar', async () => {
    const wrapper = mount(ClientesTabla, {
      props: { clientes: [cliente], indiceInicial: 1 },
    })
    await wrapper.find('.accion--editar').trigger('click')
    await wrapper.find('.accion--eliminar').trigger('click')
    expect(wrapper.emitted('editar')?.[0]).toEqual([cliente])
    expect(wrapper.emitted('eliminar')?.[0]).toEqual([cliente])
  })
})
