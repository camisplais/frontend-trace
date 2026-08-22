<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

/**
 * Modal para importar el Excel/CSV de empleados.
 * No hace la peticion: solo selecciona el archivo y lo emite en `subir`.
 */
defineProps<{ subiendo?: boolean }>()

const emit = defineEmits<{ close: []; subir: [archivo: File] }>()

const EXTENSIONES = ['.xlsx', '.xls', '.csv']

const archivo = ref<File | null>(null)
const arrastrando = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

function esExtensionValida(nombre: string): boolean {
  return EXTENSIONES.some((ext) => nombre.toLowerCase().endsWith(ext))
}

function seleccionar(file: File | undefined | null) {
  if (!file) return
  if (!esExtensionValida(file.name)) return
  archivo.value = file
}

function onInput(event: Event) {
  seleccionar((event.target as HTMLInputElement).files?.[0])
}

function onDrop(event: DragEvent) {
  arrastrando.value = false
  seleccionar(event.dataTransfer?.files?.[0])
}

function confirmar() {
  if (archivo.value) emit('subir', archivo.value)
}
</script>

<template>
  <BaseModal title="Excel Personal" @close="emit('close')">
    <div
      class="dropzone"
      :class="{ 'dropzone--activa': arrastrando }"
      role="button"
      tabindex="0"
      @click="inputEl?.click()"
      @keydown.enter="inputEl?.click()"
      @dragover.prevent="arrastrando = true"
      @dragleave.prevent="arrastrando = false"
      @drop.prevent="onDrop"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropzone__icon">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <path d="M17 8l-5-5-5 5M12 3v12" />
      </svg>
      <p class="dropzone__titulo">Elige un archivo</p>
      <p class="dropzone__ayuda">o arrástralo hasta aquí</p>
      <input
        ref="inputEl"
        type="file"
        accept=".xlsx,.xls,.csv"
        class="dropzone__input"
        @change="onInput"
      />
    </div>

    <label class="campo">
      <span class="campo__label">ARCHIVO SELECCIONADO</span>
      <span class="campo__valor" :class="{ 'campo__valor--vacio': !archivo }">
        {{ archivo?.name ?? 'Ningún archivo seleccionado' }}
      </span>
    </label>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton
        variant="primary"
        :disabled="!archivo || subiendo"
        @click="confirmar"
      >
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
  gap: var(--space-1);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  padding: var(--space-7) var(--space-5);
  text-align: center;
  cursor: pointer;
}
.dropzone--activa { border-color: var(--color-primary); }
.dropzone__icon { width: 28px; height: 28px; color: var(--color-text-muted); margin-bottom: var(--space-2); }
.dropzone__titulo { font-weight: var(--fw-semibold); color: var(--color-text); }
.dropzone__ayuda { font-size: var(--fs-xs); color: var(--color-text-muted); }
.dropzone__input { display: none; }

.campo {
  display: block;
  margin-top: var(--space-5);
}
.campo__label {
  display: block;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: var(--space-2);
}
.campo__valor {
  display: block;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
  color: var(--color-text);
}
.campo__valor--vacio { color: var(--color-text-muted); }
</style>
