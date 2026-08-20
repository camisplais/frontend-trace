<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

/**
 * Modal para elegir y subir el archivo del plan de embarque.
 * No sabe de negocio: recibe el estado por props y emite eventos.
 */
defineProps<{
  archivo: File | null
  subiendo: boolean
  error: string | null
}>()

const emit = defineEmits<{
  elegir: [file: File | null]
  subir: []
  close: []
}>()

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  emit('elegir', input.files?.[0] ?? null)
}
</script>

<template>
  <BaseModal title="Cronograma" @close="emit('close')">
    <label class="dropzone">
      <input
        type="file"
        class="dropzone__input"
        accept=".csv,.xls,.xlsx"
        @change="onChange"
      />
      <svg class="dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <path d="M17 8l-5-5-5 5M12 3v12" />
      </svg>
      <span class="dropzone__title">Elige un archivo</span>
      <span class="dropzone__hint">o arrástralo hasta aquí</span>
    </label>

    <p class="field-label">ARCHIVO SELECCIONADO</p>
    <div class="selected-file">
      {{ archivo?.name ?? 'Ningún archivo seleccionado' }}
    </div>

    <p v-if="error" class="banner banner--error">{{ error }}</p>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" :disabled="!archivo || subiendo" @click="emit('subir')">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <path d="M17 8l-5-5-5 5M12 3v12" />
          </svg>
        </template>
        {{ subiendo ? 'Subiendo…' : 'Subir' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1.5px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: var(--space-8) var(--space-5);
  text-align: center;
  cursor: pointer;
  color: var(--color-text-muted);
}

.dropzone:hover {
  border-color: var(--color-primary);
}

.dropzone__input {
  display: none;
}

.dropzone__icon {
  width: 32px;
  height: 32px;
  color: var(--color-text-faint);
}

.dropzone__title {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}

.dropzone__hint {
  font-size: var(--fs-xs);
}

.field-label {
  margin: var(--space-5) 0 var(--space-2);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.selected-file {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.banner {
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
  margin-top: var(--space-4);
}

.banner--error {
  background-color: #fdecec;
  color: var(--color-danger);
}
</style>
