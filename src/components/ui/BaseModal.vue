<script setup lang="ts">
withDefaults(defineProps<{ title: string; size?: 'sm' | 'lg' }>(), {
  size: 'sm',
})
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal" :class="`modal--${size}`" role="dialog" aria-modal="true">
      <header class="modal__header">
        <h2 class="modal__title">{{ title }}</h2>
        <button class="modal__close" type="button" aria-label="Cerrar" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>
      <div class="modal__body">
        <slot />
      </div>
      <footer v-if="$slots.footer" class="modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  z-index: 50;
}

.modal {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 440px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-5) var(--space-4);
}

.modal__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
}

.modal__close {
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.modal__close svg {
  width: 20px;
  height: 20px;
}

.modal__body {
  padding: 0 var(--space-5) var(--space-5);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: 0 var(--space-5) var(--space-5);
}
</style>
