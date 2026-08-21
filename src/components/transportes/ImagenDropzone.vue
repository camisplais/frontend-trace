<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'

/**
 * Dropzone reutilizable para subir/reemplazar la imagen de un transporte.
 * Soporta arrastrar-soltar y clic. No sabe de negocio: recibe el archivo por
 * `modelValue` y emite el cambio. Genera una vista previa del archivo elegido.
 */
const props = withDefaults(
  defineProps<{
    modelValue: File | null
    /** Texto principal del dropzone. */
    label?: string
    /** Compacto = versión más pequeña (para el modal de edición). */
    compacto?: boolean
  }>(),
  {
    modelValue: null,
    label: 'Arrastre una imagen o haga clic para cargar',
    compacto: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [file: File | null] }>()

const arrastrando = ref(false)
const previewUrl = ref<string | null>(null)

// Mantiene la vista previa en sync con el archivo y libera la URL anterior.
watch(
  () => props.modelValue,
  (file) => {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = file ? URL.createObjectURL(file) : null
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const nombreArchivo = computed(() => props.modelValue?.name ?? null)

function onInput(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.files?.[0] ?? null)
  input.value = '' // permite volver a elegir el mismo archivo
}

function onDrop(event: DragEvent) {
  arrastrando.value = false
  const file = event.dataTransfer?.files?.[0] ?? null
  emit('update:modelValue', file)
}
</script>

<template>
  <label
    class="dropzone"
    :class="{ 'dropzone--activo': arrastrando, 'dropzone--compacto': compacto }"
    @dragover.prevent="arrastrando = true"
    @dragleave.prevent="arrastrando = false"
    @drop.prevent="onDrop"
  >
    <input
      type="file"
      class="dropzone__input"
      accept="image/jpeg,image/png"
      @change="onInput"
    />

    <img v-if="previewUrl" :src="previewUrl" alt="Vista previa" class="dropzone__preview" />

    <template v-else>
      <svg class="dropzone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span class="dropzone__label">{{ label }}</span>
      <span class="dropzone__hint">JPG o PNG · máx. 5MB</span>
    </template>

    <span v-if="nombreArchivo" class="dropzone__file">{{ nombreArchivo }}</span>
  </label>
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
  min-height: 180px;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.dropzone--compacto {
  padding: var(--space-5);
  min-height: 120px;
}

.dropzone:hover,
.dropzone--activo {
  border-color: var(--color-primary);
  background-color: var(--color-primary-soft);
}

.dropzone__input {
  display: none;
}

.dropzone__icon {
  width: 34px;
  height: 34px;
  color: var(--color-text-faint);
}

.dropzone__label {
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  max-width: 220px;
}

.dropzone__hint {
  font-size: var(--fs-xs);
  color: var(--color-text-faint);
}

.dropzone__preview {
  max-height: 130px;
  max-width: 100%;
  border-radius: var(--radius-sm);
  object-fit: contain;
}

.dropzone__file {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  word-break: break-all;
}
</style>
