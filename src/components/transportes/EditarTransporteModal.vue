<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ImagenDropzone from './ImagenDropzone.vue'
import { resolverImagenUrl } from '@/services/transportes.service'
import { estadoTransporteLabel, type Transporte } from '@/types/transporte'

const props = defineProps<{
  transporte: Transporte
  guardando?: boolean
}>()

const emit = defineEmits<{
  guardar: [cambios: { placas: string; imagen: File | null }]
  close: []
}>()

// Solo placa e imagen son editables (regla del backend).
const placas = ref(props.transporte.placas)
const nuevaImagen = ref<File | null>(null)

const imagenActualUrl = computed(() =>
  resolverImagenUrl(props.transporte.imagen),
)

const placaValida = computed(() => placas.value.trim() !== '')

/** Hay algo que guardar si cambió la placa o se eligió imagen nueva. */
const hayCambios = computed(
  () =>
    placas.value.trim() !== props.transporte.placas ||
    nuevaImagen.value !== null,
)

function guardar() {
  if (!placaValida.value) return
  emit('guardar', {
    placas: placas.value.trim(),
    imagen: nuevaImagen.value,
  })
}
</script>

<template>
  <BaseModal title="Editar transporte" size="lg" @close="emit('close')">
    <div class="campos">
      <!-- Nombre de la unidad (marca) — no editable -->
      <div class="campo">
        <span class="campo__label">
          NOMBRE DE LA UNIDAD
          <span class="campo__flag campo__flag--lock">No editable</span>
        </span>
        <input :value="transporte.marca" type="text" class="campo__input" disabled />
      </div>

      <!--
        El diseño muestra "Modelo / Tipo de carrocería" (no editable), pero el
        backend no tiene ese campo. Usamos Carga útil, que sí existe y es útil.
      -->
      <div class="campo">
        <span class="campo__label">
          CARGA ÚTIL
          <span class="campo__flag campo__flag--lock">No editable</span>
        </span>
        <input :value="`${transporte.carga_util} KG`" type="text" class="campo__input" disabled />
      </div>

      <!-- Placa — editable -->
      <div class="campo">
        <span class="campo__label">
          PLACA <span class="campo__flag campo__flag--edit">Editable</span>
        </span>
        <input v-model="placas" type="text" maxlength="10" class="campo__input campo__input--edit" />
      </div>

      <!-- Estado de unidad — no editable -->
      <div class="campo">
        <span class="campo__label">
          ESTADO DE UNIDAD
          <span class="campo__flag campo__flag--lock">No editable</span>
        </span>
        <div class="campo__lockwrap">
          <input :value="estadoTransporteLabel[transporte.estado]" type="text" class="campo__input" disabled />
          <svg class="campo__lockicon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Imagen — editable -->
    <div class="imagen">
      <span class="campo__label">
        IMAGEN <span class="campo__flag campo__flag--edit">Editable</span>
      </span>
      <div class="imagen__grid">
        <div class="imagen__actual">
          <img v-if="imagenActualUrl" :src="imagenActualUrl" alt="Imagen actual" class="imagen__thumb" />
          <svg
            v-else
            class="imagen__thumb-placeholder"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
            <circle cx="7" cy="17" r="1.6" />
            <circle cx="17.5" cy="17" r="1.6" />
          </svg>
          <span class="imagen__tag">ACTUAL</span>
        </div>

        <ImagenDropzone
          v-model="nuevaImagen"
          compacto
          label="Arrastre una nueva imagen o haga clic para reemplazar"
        />
      </div>
    </div>

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
        :disabled="!placaValida || !hayCambios || guardando"
        @click="guardar"
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
.campos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.campo__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.campo__flag {
  font-weight: var(--fw-regular);
  font-size: 0.68rem;
}

.campo__flag--lock {
  color: var(--color-text-faint);
}

.campo__flag--edit {
  color: var(--color-primary);
}

.campo__input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text);
  background-color: var(--color-surface);
  width: 100%;
}

.campo__input:disabled {
  background-color: var(--color-bg);
  color: var(--color-text-muted);
}

.campo__input--edit:focus {
  outline: none;
  border-color: var(--color-primary);
}

.campo__lockwrap {
  position: relative;
}

.campo__lockicon {
  position: absolute;
  right: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-faint);
}

.imagen {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.imagen__grid {
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: var(--space-4);
  align-items: stretch;
}

.imagen__actual {
  position: relative;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  overflow: hidden;
}

.imagen__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imagen__thumb-placeholder {
  width: 40px;
  height: 40px;
  color: var(--color-text-faint);
}

.imagen__tag {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f2937;
  color: #fff;
  font-size: 0.6rem;
  font-weight: var(--fw-semibold);
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.04em;
}

@media (max-width: 520px) {
  .campos {
    grid-template-columns: 1fr;
  }
}
</style>
