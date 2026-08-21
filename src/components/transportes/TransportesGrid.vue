<script setup lang="ts">
import TransporteCard from './TransporteCard.vue'
import type { Transporte } from '@/types/transporte'

defineProps<{
  transportes: Transporte[]
  cargando?: boolean
}>()

const emit = defineEmits<{
  editar: [transporte: Transporte]
  eliminar: [transporte: Transporte]
}>()
</script>

<template>
  <div>
    <p v-if="cargando" class="estado-msg">Cargando transportes…</p>

    <p v-else-if="transportes.length === 0" class="estado-msg">
      No hay transportes para mostrar.
    </p>

    <div v-else class="grid">
      <TransporteCard
        v-for="t in transportes"
        :key="t.id"
        :transporte="t"
        @editar="emit('editar', $event)"
        @eliminar="emit('eliminar', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-5);
}

.estado-msg {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-8);
  font-size: var(--fs-sm);
}
</style>
