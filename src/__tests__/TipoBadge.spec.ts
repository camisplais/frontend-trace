import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TipoBadge from '@/components/ui/TipoBadge.vue'

describe('TipoBadge', () => {
  it('muestra la etiqueta Regular', () => {
    const wrapper = mount(TipoBadge, { props: { tipo: 'regular' } })
    expect(wrapper.text()).toBe('Regular')
    expect(wrapper.classes()).toContain('tipo-badge--regular')
  })

  it('muestra la etiqueta Expeditado', () => {
    const wrapper = mount(TipoBadge, { props: { tipo: 'expeditado' } })
    expect(wrapper.text()).toBe('Expeditado')
    expect(wrapper.classes()).toContain('tipo-badge--expeditado')
  })
})
