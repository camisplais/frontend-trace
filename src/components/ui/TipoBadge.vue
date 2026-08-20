<script setup lang="ts">
import { tipoEmbarqueLabel, type TipoEmbarque } from '@/types/embarque'

defineProps<{ tipo: TipoEmbarque }>()
</script>

<template>
  <span class="tipo-badge" :class="`tipo-badge--${tipo}`">
    <span class="tipo-badge__dot" />
    {{ tipoEmbarqueLabel[tipo] }}
  </span>
</template>

<style scoped>
.tipo-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.tipo-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: currentColor;
}

.tipo-badge--regular {
  color: var(--color-regular);
}

.tipo-badge--expeditado {
  color: var(--color-expedito-text);
  background-color: var(--color-expedito-bg);
}
</style>
