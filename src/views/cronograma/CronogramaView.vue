<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import SubirArchivoModal from '@/components/cronograma/SubirArchivoModal.vue'
import CronogramaTabla from '@/components/cronograma/CronogramaTabla.vue'
import { useCronograma } from '@/composables/useCronograma'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const {
  filas,
  clientes,
  cronogramaCargado,
  archivo,
  subiendo,
  guardando,
  hayFilasConError,
  puedeGuardar,
  cargarClientes,
  elegirArchivo,
  subir,
  guardar,
} = useCronograma()

const modalAbierto = ref(false)

onMounted(cargarClientes)

function abrirModal() {
  elegirArchivo(null)
  modalAbierto.value = true
}

async function onSubir() {
  const ok = await subir()
  if (ok) modalAbierto.value = false
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Cronograma</h1>
      <BaseButton variant="secondary" @click="abrirModal">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
          </svg>
        </template>
        Editar archivo
      </BaseButton>
    </header>

    <!-- Estado vacío -->
    <div v-if="!cronogramaCargado" class="card card--empty">
      <div class="empty">
        <svg class="empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <p class="empty__title">Aún no hay cronograma cargado</p>
        <p class="empty__hint">Sube el archivo del cliente para generar el cronograma de entregas.</p>
      </div>
    </div>

    <!-- Tabla -->
    <div v-else class="card">
      <CronogramaTabla :filas="filas" :clientes="clientes" :cs-nombre="auth.user?.nombre ?? ''" />

      <p v-if="hayFilasConError" class="hint-error">
        Hay filas con errores que no se guardarán. Corrige el archivo y vuelve a subirlo si las necesitas.
      </p>

      <footer class="table-footer">
        <BaseButton variant="primary" :disabled="!puedeGuardar || guardando" @click="guardar">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <path d="M17 21v-8H7v8M7 3v5h8" />
            </svg>
          </template>
          {{ guardando ? 'Guardando…' : 'Guardar' }}
        </BaseButton>
      </footer>
    </div>

    <SubirArchivoModal
      v-if="modalAbierto"
      :archivo="archivo"
      :subiendo="subiendo"
      @elegir="elegirArchivo"
      @subir="onSubir"
      @close="modalAbierto = false"
    />
  </section>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
}

.page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.page__title {
  font-size: var(--fs-xl);
  font-weight: var(--fw-bold);
}

.banner {
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-4);
}

.banner--error {
  background-color: #fdecec;
  color: var(--color-danger);
}

.banner--ok {
  background-color: #e7f6ec;
  color: var(--color-success);
}

.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
}

.card--empty {
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: var(--color-text-muted);
}

.empty__icon {
  width: 44px;
  height: 44px;
  color: var(--color-text-faint);
  margin-bottom: var(--space-4);
}

.empty__title {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.empty__hint {
  font-size: var(--fs-sm);
}

.hint-error {
  margin-top: var(--space-4);
  font-size: var(--fs-xs);
  color: var(--color-danger);
}

.table-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-5);
}
</style>
