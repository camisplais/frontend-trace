<script setup lang="ts">
import { computed } from 'vue'
import EstadoBadge from './EstadoBadge.vue'
import { resolverImagenUrl } from '@/services/transportes.service'
import type { Transporte } from '@/types/transporte'

const props = defineProps<{ transporte: Transporte }>()

const emit = defineEmits<{
  editar: [transporte: Transporte]
  eliminar: [transporte: Transporte]
}>()

const imagenUrl = computed(() => resolverImagenUrl(props.transporte.imagen))
</script>

<template>
  <article class="card">
    <div class="card__media">
      <EstadoBadge class="card__estado" :estado="transporte.estado" />
      <img v-if="imagenUrl" :src="imagenUrl" :alt="transporte.marca" class="card__img" />
      <svg
        v-else
        class="card__placeholder"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
        <circle cx="7" cy="17" r="1.6" />
        <circle cx="17.5" cy="17" r="1.6" />
      </svg>
    </div>

    <div class="card__body">
      <h3 class="card__marca">{{ transporte.marca }}</h3>
      <div class="card__foot">
        <span class="card__placas">{{ transporte.placas }}</span>
        <div class="card__acciones">
          <button
            class="accion accion--editar"
            type="button"
            aria-label="Editar"
            @click="emit('editar', transporte)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
            </svg>
          </button>
          <button
            class="accion accion--eliminar"
            type="button"
            aria-label="Eliminar"
            @click="emit('eliminar', transporte)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card__media {
  position: relative;
  height: 130px;
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__estado {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
}

.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__placeholder {
  width: 64px;
  height: 64px;
  color: var(--color-text-faint);
}

.card__body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card__marca {
  font-size: var(--fs-md);
  font-weight: var(--fw-bold);
  color: var(--color-text);
}

.card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.card__placas {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
}

.card__acciones {
  display: flex;
  gap: var(--space-2);
}

.accion {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.accion svg {
  width: 16px;
  height: 16px;
}

.accion--editar {
  background-color: #eaf1fb;
  color: #2563eb;
}

.accion--editar:hover {
  background-color: #d8e6fa;
}

.accion--eliminar {
  background-color: #fdecec;
  color: var(--color-danger);
}

.accion--eliminar:hover {
  background-color: #f9dada;
}
</style>
