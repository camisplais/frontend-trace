<script setup lang="ts">
import type { EmbarquePendiente } from '@/types/embarquePendiente'

defineProps<{
  visible: boolean
  viajeId: number | null
  embarquesPendientes: EmbarquePendiente[]
  enviando?: boolean
}>()

const emit = defineEmits<{
  confirmar: []
  cancelar: []
}>()
</script>

<template>
  <div v-if="visible" class="overlay" @click.self="emit('cancelar')">
    <div class="modal">
      <div class="modal__icono">⚠</div>
      <h3 class="modal__titulo">Pruebas de entrega incompletas</h3>
      <p class="modal__texto">
        El viaje #{{ viajeId }} tiene al menos un embarque sin pruebas de entrega registradas.
      </p>

      <div v-for="p in embarquesPendientes" :key="p.viaje_embarque_id" class="modal__aviso">
        <span class="modal__aviso-icono">!</span>
        <span>
          <strong>{{ p.embarque.cliente.nombre }} ({{ p.embarque.plan_embarque }})</strong>
          no tiene pruebas de entrega.
        </span>
      </div>

      <p class="modal__pregunta">
        ¿Deseas continuar y solicitar el código QR al Coordinador de Stock?
      </p>

      <button class="modal__btn modal__btn--primario" :disabled="enviando" @click="emit('confirmar')">
        {{ enviando ? 'Enviando…' : '➤ Solicitar QR al Coordinador' }}
      </button>
      <button class="modal__btn modal__btn--secundario" @click="emit('cancelar')">
        ✕ Cancelar
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.modal__icono {
  width: 48px;
  height: 48px;
  margin: 0 auto var(--space-4);
  border-radius: var(--radius-full);
  background: #fdece0;
  color: #e67e22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--fs-lg);
}

.modal__titulo {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-3);
}

.modal__texto {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.modal__aviso {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-align: left;
  background: #fdecea;
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-sm);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
  color: var(--color-danger);
  margin-bottom: var(--space-3);
}

.modal__aviso-icono {
  font-weight: var(--fw-bold);
}

.modal__pregunta {
  font-size: var(--fs-sm);
  color: var(--color-text);
  margin-bottom: var(--space-5);
}

.modal__btn {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  margin-bottom: var(--space-3);
}

.modal__btn--primario {
  background: var(--color-primary);
  color: #fff;
  border: none;
}

.modal__btn--primario:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal__btn--secundario {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border-strong);
  margin-bottom: 0;
}
</style>
