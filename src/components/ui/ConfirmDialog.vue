<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

withDefaults(
  defineProps<{
    title: string
    message: string
    confirmLabel?: string
  }>(),
  { confirmLabel: 'Eliminar' },
)

const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <BaseModal :title="title" @close="emit('close')">
    <p class="mensaje">{{ message }}</p>
    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" @click="emit('confirm')">{{ confirmLabel }}</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.mensaje {
  color: var(--color-text);
  font-size: var(--fs-sm);
  line-height: 1.5;
}
</style>
