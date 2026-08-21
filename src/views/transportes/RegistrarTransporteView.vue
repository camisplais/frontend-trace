<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import ImagenDropzone from '@/components/transportes/ImagenDropzone.vue'
import { useRegistrarTransporte } from '@/composables/useRegistrarTransporte'
import { alerta } from '@/services/alerta'

const router = useRouter()
const {
  marca,
  placas,
  cargaUtil,
  imagen,
  guardando,
  puedeRegistrar,
  elegirImagen,
  registrar,
} = useRegistrarTransporte()

async function onRegistrar() {
  const ok = await registrar()
  if (ok) {
    await alerta.exito('¡Registro guardado!', 'La información se guardó correctamente.')
    router.push({ name: 'transportes' })
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Registrar Transporte</h1>
    </header>

    <div class="card">
      <div class="grid">
        <!-- Formulario -->
        <form class="form" @submit.prevent="onRegistrar">
          <label class="campo">
            <span class="campo__label">MARCA <span class="req">Obligatorio</span></span>
            <input
              v-model="marca"
              type="text"
              maxlength="30"
              class="campo__input"
              placeholder="Ej. Freightliner, Mercedes-Benz"
            />
          </label>

          <label class="campo">
            <span class="campo__label">PLACAS <span class="req">Obligatorio</span></span>
            <input
              v-model="placas"
              type="text"
              maxlength="10"
              class="campo__input"
              placeholder="Ej. AXG-34-2"
            />
          </label>

          <label class="campo">
            <span class="campo__label">CARGA ÚTIL (KG) <span class="req">Obligatorio</span></span>
            <input
              v-model="cargaUtil"
              type="text"
              inputmode="numeric"
              class="campo__input"
              placeholder="Ej. 6000"
            />
          </label>

          <div class="acciones">
            <BaseButton variant="primary" type="submit" :disabled="!puedeRegistrar || guardando">
              <template #icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </template>
              {{ guardando ? 'Registrando…' : 'Registrar' }}
            </BaseButton>
            <BaseButton variant="secondary" @click="router.push({ name: 'transportes' })">
              <template #icon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </template>
              Cancelar
            </BaseButton>
          </div>
        </form>

        <!-- Imagen -->
        <div class="imagen">
          <span class="campo__label">IMAGEN</span>
          <ImagenDropzone
            :model-value="imagen"
            @update:model-value="elegirImagen"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}

.page__header {
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}

@media (max-width: 720px) {
  .grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

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

.req {
  color: var(--color-danger);
  font-weight: var(--fw-regular);
}

.campo__input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text);
  background-color: var(--color-surface);
}

.campo__input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.imagen {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.acciones {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
</style>
