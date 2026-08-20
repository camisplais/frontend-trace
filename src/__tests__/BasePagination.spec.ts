import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePagination from '@/components/ui/BasePagination.vue'

describe('BasePagination', () => {
  it('emite change con la página elegida', async () => {
    const wrapper = mount(BasePagination, { props: { page: 1, totalPages: 3 } })
    await wrapper.findAll('.paginacion__num')[2]!.trigger('click')
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
  })

  it('deshabilita la flecha anterior en la primera página', () => {
    const wrapper = mount(BasePagination, { props: { page: 1, totalPages: 3 } })
    const anterior = wrapper.find('.paginacion__flecha')
    expect(anterior.attributes('disabled')).toBeDefined()
  })

  it('no emite change fuera de rango', async () => {
    const wrapper = mount(BasePagination, { props: { page: 3, totalPages: 3 } })
    const flechas = wrapper.findAll('.paginacion__flecha')
    await flechas[flechas.length - 1]!.trigger('click') // siguiente, ya en la última
    expect(wrapper.emitted('change')).toBeUndefined()
  })
})
