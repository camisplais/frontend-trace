<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', disabled: false },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="`btn--${variant}`"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--primary {
  background-color: var(--color-primary);
  color: #fff;
}

.btn--primary:not(:disabled):hover {
  background-color: var(--color-primary-hover);
}

.btn--secondary {
  background-color: var(--color-surface);
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.btn--secondary:not(:disabled):hover {
  background-color: var(--color-bg);
}

.btn :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
