<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { tiposCliente, tipoClienteLabel, type TipoCliente } from '@/types/cliente'

defineProps<{
  nombre: string
  ciudad: string
  tipo: TipoCliente | ''
}>()

const emit = defineEmits<{
  'update:nombre': [value: string]
  'update:ciudad': [value: string]
  'update:tipo': [value: TipoCliente | '']
  aplicar: []
}>()
</script>

<template>
  <div class="filtros">
    <label class="filtros__campo">
      <span class="filtros__label">NOMBRE</span>
      <input
        :value="nombre"
        type="text"
        @input="emit('update:nombre', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="filtros__campo">
      <span class="filtros__label">CIUDAD</span>
      <input
        :value="ciudad"
        type="text"
        @input="emit('update:ciudad', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="filtros__campo">
      <span class="filtros__label">TIPO</span>
      <select
        :value="tipo"
        @change="emit('update:tipo', ($event.target as HTMLSelectElement).value as TipoCliente | '')"
      >
        <option value="">Todos</option>
        <option v-for="t in tiposCliente" :key="t" :value="t">{{ tipoClienteLabel[t] }}</option>
      </select>
    </label>

    <BaseButton variant="primary" @click="emit('aplicar')">
      <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />
        </svg>
      </template>
      Aplicar
    </BaseButton>
  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  align-items: flex-end;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.filtros__campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 160px;
}

.filtros__label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.filtros__campo input,
.filtros__campo select {
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.filtros__campo input:focus,
.filtros__campo select:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
