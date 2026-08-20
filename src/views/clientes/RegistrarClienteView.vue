<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import PruebasChecklist from '@/components/clientes/PruebasChecklist.vue'
import { useRegistrarCliente } from '@/composables/useRegistrarCliente'
import { tiposCliente, tipoClienteLabel } from '@/types/cliente'

const router = useRouter()
const {
  nombre,
  ubicacion,
  tipo,
  documentos,
  guardando,
  error,
  pruebasNecesarias,
  puedeRegistrar,
  cargarDocumentos,
  registrar,
} = useRegistrarCliente()

onMounted(cargarDocumentos)

async function onRegistrar() {
  const ok = await registrar()
  if (ok) router.push({ name: 'clientes' })
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Registrar Cliente</h1>
    </header>

    <div class="card">
      <div class="grid">
        <!-- Formulario -->
        <form class="form" @submit.prevent="onRegistrar">
          <label class="campo">
            <span class="campo__label">NOMBRE <span class="req">Obligatorio</span></span>
            <input v-model="nombre" type="text" class="campo__input" />
          </label>

          <label class="campo">
            <span class="campo__label">UBICACIÓN <span class="req">Obligatorio</span></span>
            <input v-model="ubicacion" type="text" class="campo__input" />
          </label>

          <label class="campo">
            <span class="campo__label">TIPO DE CLIENTE</span>
            <select v-model="tipo" class="campo__input">
              <option value="" disabled>Selecciona…</option>
              <option v-for="t in tiposCliente" :key="t" :value="t">{{ tipoClienteLabel[t] }}</option>
            </select>
          </label>

          <p v-if="error" class="banner banner--error">{{ error }}</p>

          <div class="acciones">
            <BaseButton variant="primary" type="submit" :disabled="!puedeRegistrar || guardando">
              {{ guardando ? 'Registrando…' : 'Registrar' }}
            </BaseButton>
            <BaseButton variant="secondary" @click="router.push({ name: 'clientes' })">
              Cancelar
            </BaseButton>
          </div>
        </form>

        <!-- Pruebas de entrega (derivadas del tipo) -->
        <PruebasChecklist :documentos="documentos" :seleccionadas="pruebasNecesarias" />
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

.banner {
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
}

.banner--error {
  background-color: #fdecec;
  color: var(--color-danger);
}

.acciones {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
</style>
