<script setup lang="ts">
import { estadoTransporteLabel, type EstadoTransporte } from '@/types/transporte'

defineProps<{ estado: EstadoTransporte }>()
</script>

<template>
  <span class="estado-badge" :class="`estado-badge--${estado}`">
    <span class="estado-badge__dot" />
    {{ estadoTransporteLabel[estado] }}
  </span>
</template>

<style scoped>
.estado-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}

.estado-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: currentColor;
}

/* En planta = disponible (verde) */
.estado-badge--planta {
  color: var(--color-success);
  background-color: #eafaf0;
}

/* Fuera de planta = en viaje (rojo) */
.estado-badge--viaje {
  color: var(--color-danger);
  background-color: #fdecec;
}
</style>
