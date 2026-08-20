<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="plan-chip">{{ label }}</span>
</template>

<style scoped>
.plan-chip {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--color-info-bg);
  color: var(--color-info-text);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}
</style>
