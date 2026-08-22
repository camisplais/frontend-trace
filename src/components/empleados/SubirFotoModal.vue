<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { nombreCompleto, iniciales, type Empleado } from '@/types/empleado'
import { resolverImagenUrl } from '@/services/empleados.service'

/**
 * Modal para subir/reemplazar la foto de un empleado.
 * Solo selecciona y previsualiza; emite `subir` con el archivo.
 */
const props = defineProps<{ empleado: Empleado; subiendo?: boolean }>()

const emit = defineEmits<{ close: []; subir: [archivo: File] }>()

const TIPOS = ['image/jpeg', 'image/png']

const archivo = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const fotoActual = computed(() => resolverImagenUrl(props.empleado.imagen))

function limpiarPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

function onInput(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !TIPOS.includes(file.type)) return
  limpiarPreview()
  archivo.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function confirmar() {
  if (archivo.value) emit('subir', archivo.value)
}

onBeforeUnmount(limpiarPreview)
</script>

<template>
  <BaseModal title="Foto del empleado" @close="emit('close')">
    <p class="empleado">{{ nombreCompleto(empleado) }}</p>

    <div class="preview">
      <img v-if="previewUrl" :src="previewUrl" alt="Vista previa" class="preview__img" />
      <img v-else-if="fotoActual" :src="fotoActual" alt="Foto actual" class="preview__img" />
      <span v-else class="preview__placeholder">{{ iniciales(empleado) }}</span>
    </div>

    <div class="acciones-archivo">
      <BaseButton variant="secondary" @click="inputEl?.click()">
        {{ archivo ? 'Elegir otra' : 'Elegir foto' }}
      </BaseButton>
      <span class="acciones-archivo__nombre">
        {{ archivo?.name ?? 'JPG o PNG, máx 5MB' }}
      </span>
      <input
        ref="inputEl"
        type="file"
        accept="image/jpeg,image/png"
        class="input-oculto"
        @change="onInput"
      />
    </div>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" :disabled="!archivo || subiendo" @click="confirmar">
        {{ subiendo ? 'Subiendo…' : 'Subir' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.empleado {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-4);
}
.preview {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-5);
}
.preview__img,
.preview__placeholder {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  object-fit: cover;
}
.preview__placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
}
.acciones-archivo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.acciones-archivo__nombre {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}
.input-oculto { display: none; }
</style>
