import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renderiza el contenido del slot', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Guardar' } })
    expect(wrapper.text()).toContain('Guardar')
  })

  it('aplica la clase de la variante', () => {
    const wrapper = mount(BaseButton, { props: { variant: 'secondary' } })
    expect(wrapper.classes()).toContain('btn--secondary')
  })
})
