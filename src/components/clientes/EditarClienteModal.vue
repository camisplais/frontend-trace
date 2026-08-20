<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { Cliente } from '@/types/cliente'

const props = defineProps<{
  cliente: Cliente
  guardando?: boolean
}>()

const emit = defineEmits<{
  guardar: [nombre: string]
  close: []
}>()

const nombre = ref(props.cliente.nombre)
</script>

<template>
  <BaseModal title="Editar cliente" @close="emit('close')">
    <label class="campo">
      <span class="campo__label">NOMBRE</span>
      <input v-model="nombre" type="text" class="campo__input" />
    </label>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </template>
        Cancelar
      </BaseButton>
      <BaseButton
        variant="primary"
        :disabled="!nombre.trim() || guardando"
        @click="emit('guardar', nombre.trim())"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </template>
        {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.campo__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.campo__input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text);
}

.campo__input:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
