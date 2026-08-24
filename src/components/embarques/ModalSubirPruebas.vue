<script setup lang="ts">
import type { EmbarquePendienteGlobal } from '@/types/embarquePendienteGlobal'
import type { DocsFaltantesEmbarque } from '@/types/documentoFaltante'
import BaseButton from '@/components/ui/BaseButton.vue'
import { watch } from 'vue'

const props = defineProps<{
  visible: boolean
  item: EmbarquePendienteGlobal | null
  docsFaltantes: DocsFaltantesEmbarque | null
  cargandoDocs: boolean
  archivosPorDoc: Record<number, File | null>
  subidoPorDoc: Record<number, boolean>
  subiendoPorDoc: Record<number, boolean>
}>()

watch(() => props.archivosPorDoc, (nuevo) => {
  console.log('archivosPorDoc cambió en el modal:', nuevo)
}, { deep: true })

const emit = defineEmits<{
  fileChange: [docId: number, event: Event]
  subir: [docId: number]
  cerrar: []
}>()
</script>

<template>
  <div v-if="visible" class="overlay" @click.self="emit('cerrar')">
    <div class="modal">
      <header class="modal__header">
        <div>
          <h3 class="modal__titulo">Subir pruebas de entrega</h3>
          <p class="modal__subtitulo" v-if="item">
            {{ item.embarque.cliente.nombre }} — {{ item.embarque.plan_embarque }}
          </p>
        </div>
        <button class="modal__cerrar" type="button" aria-label="Cerrar" @click="emit('cerrar')">×</button>
      </header>

      <p v-if="cargandoDocs" class="modal__cargando">Cargando documentos…</p>

      <div v-else-if="docsFaltantes" class="documentos">
        <p v-if="docsFaltantes.docsFaltantes.length === 0" class="modal__sin-pendientes">
          Ya no hay documentos pendientes por subir.
        </p>

        <div v-for="doc in docsFaltantes.docsFaltantes" :key="doc.doc_cliente_id" class="doc-item">
          <p class="doc-item__nombre">{{ doc.documento_nombre }}</p>

          <!-- Ya se subió: fila verde con palomita -->
          <div v-if="subidoPorDoc[doc.doc_cliente_id]" class="doc-subido">
            <span class="doc-subido__icono">✓</span>
            <span class="doc-subido__nombre">{{ archivosPorDoc[doc.doc_cliente_id]?.name }}</span>
          </div>

          <!-- Aún no se sube: input de archivo + botón Subir -->
          <div v-else class="doc-upload">
            <label class="file-picker">
              <input
                type="file"
                class="file-picker__input"
                @change="emit('fileChange', doc.doc_cliente_id, $event)"
              />
              <span class="file-picker__text">
                {{ archivosPorDoc[doc.doc_cliente_id]?.name ?? 'Ningún archivo seleccionado' }}
              </span>
              <span class="file-picker__btn">Elegir archivo</span>
            </label>
            <BaseButton
              :disabled="subiendoPorDoc[doc.doc_cliente_id]"
              @click="emit('subir', doc.doc_cliente_id)"
            >
              {{ subiendoPorDoc[doc.doc_cliente_id] ? 'Subiendo…' : 'Subir' }}
            </BaseButton>
          </div>
        </div>
      </div>

      <footer class="modal__footer">
        <BaseButton variant="secondary" @click="emit('cerrar')">Cerrar</BaseButton>
      </footer>
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
  padding: var(--space-4);
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 520px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: var(--shadow-md);
}

.modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.modal__titulo {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}

.modal__subtitulo {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.modal__cerrar {
  background: none;
  border: none;
  font-size: var(--fs-lg);
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1;
}

.modal__cargando,
.modal__sin-pendientes {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  text-align: center;
  padding: var(--space-5) 0;
}

.doc-item {
  margin-bottom: var(--space-4);
}

.doc-item__nombre {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  margin-bottom: var(--space-2);
}

.doc-upload {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.file-picker {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  cursor: pointer;
}

.file-picker__input {
  display: none;
}

.file-picker__text {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
}

.file-picker__btn {
  padding: var(--space-2) var(--space-4);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  white-space: nowrap;
}

.doc-subido {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background-color: #eefaf1;
  border: 1px solid var(--color-success);
  border-radius: var(--radius-sm);
}

.doc-subido__icono {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: var(--color-success);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
}

.doc-subido__nombre {
  font-size: var(--fs-sm);
  color: var(--color-text);
  flex: 1;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
  margin-top: var(--space-5);
}
</style>
