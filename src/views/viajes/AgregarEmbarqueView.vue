<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgregarEmbarque } from '@/composables/useAgregarEmbarque'
import BaseButton from '@/components/ui/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const viajeId = Number(route.params.id)

const {
  viaje, embarques, embarqueId,
  documentos, archivosPorDoc, subidoPorDoc,
  cargando, cargandoDocs, enviando,
  elegirArchivo, subirDocumento, agregar,
} = useAgregarEmbarque(viajeId)

// Qué documentos decidió incluir el usuario (checkbox) — igual que en Crear Viaje
const seleccionados = reactive<Record<number, boolean>>({})

watch(documentos, (docs) => {
  for (const doc of docs) {
    seleccionados[doc.doc_cliente_id] = false
  }
})

async function onSubmit() {
  const ok = await agregar()
  if (ok) router.push({ name: 'viajes' })
}

function onFileChange(docId: number, event: Event) {
  const input = event.target as HTMLInputElement
  elegirArchivo(docId, input.files?.[0] ?? null)
}

function quitarArchivo(docId: number) {
  subidoPorDoc.value[docId] = false
  archivosPorDoc.value[docId] = null
}
</script>

<template>
  <div class="agregar-embarque">
    <button class="volver" type="button" @click="router.push({ name: 'viajes' })">
      ← Volver a Viajes
    </button>

    <p v-if="cargando">Cargando…</p>

    <section v-else class="card">
      <h2>Agregar embarque</h2>
      <p class="subtitulo">Selecciona el embarque y adjunta sus documentos de entrega.</p>

      <div class="resumen">
        <div class="resumen__item">
          <span class="resumen__label">Transporte</span>
          <span class="resumen__valor">
            {{ viaje?.transporte?.marca }} {{ viaje?.transporte?.placas }}
          </span>
        </div>
        <div class="resumen__item">
          <span class="resumen__label">Chofer</span>
          <span class="resumen__valor">
            {{ viaje?.empleado_chofer?.nombre }} {{ viaje?.empleado_chofer?.apellido_paterno }}
          </span>
        </div>
      </div>

      <div class="campo campo--full">
        <label>Embarque <span class="requerido">Requerido</span></label>
        <select v-model.number="embarqueId">
          <option :value="null" disabled>Seleccionar embarque</option>
          <option v-for="e in embarques" :key="e.id" :value="e.id">
            {{ e.plan_embarque }} — {{ e.cliente.nombre }}
          </option>
        </select>
      </div>

      <div v-if="embarqueId" class="documentos">
        <h3>Documentos de entrega <span class="requerido">Requerido</span></h3>
        <p class="documentos-subtitulo">
          Selecciona el tipo de documento y adjunta el archivo correspondiente.
        </p>

        <p v-if="cargandoDocs">Cargando documentos…</p>

        <div v-for="doc in documentos" :key="doc.doc_cliente_id" class="doc-item">
          <label class="doc-check">
            <input type="checkbox" v-model="seleccionados[doc.doc_cliente_id]" />
            <span>{{ doc.nombre }}</span>
          </label>

          <div v-if="seleccionados[doc.doc_cliente_id]">
            <div v-if="subidoPorDoc[doc.doc_cliente_id]" class="doc-subido">
              <span class="doc-subido__icono">✓</span>
              <span class="doc-subido__nombre">{{ archivosPorDoc[doc.doc_cliente_id]?.name }}</span>
              <button type="button" class="doc-subido__quitar" @click="quitarArchivo(doc.doc_cliente_id)">×</button>
            </div>
            <div v-else class="doc-upload">
              <label class="file-picker">
                <input type="file" class="file-picker__input" @change="onFileChange(doc.doc_cliente_id, $event)" />
                <span class="file-picker__text">
                  {{ archivosPorDoc[doc.doc_cliente_id]?.name ?? 'Ningún archivo seleccionado' }}
                </span>
                <span class="file-picker__btn">Elegir archivo</span>
              </label>
              <BaseButton @click="subirDocumento(doc.doc_cliente_id)">Subir</BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div class="acciones">
        <BaseButton variant="secondary" @click="router.push({ name: 'viajes' })">Cancelar</BaseButton>
        <BaseButton :disabled="enviando" @click="onSubmit">
          {{ enviando ? 'Agregando…' : '→ Agregar embarque' }}
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.agregar-embarque {
  max-width: 900px;
  margin: 0 auto;
}

.volver {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-4);
  cursor: pointer;
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}

.card h2 {
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  margin-bottom: var(--space-1);
}

.subtitulo {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-5);
}

.resumen {
  display: flex;
  gap: var(--space-6);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-5);
}

.resumen__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.resumen__label {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.resumen__valor {
  font-weight: var(--fw-semibold);
  font-size: var(--fs-sm);
}

.campo--full {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.campo--full label {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text);
}

.requerido {
  color: var(--color-danger);
  font-weight: var(--fw-medium);
  font-size: var(--fs-xs);
  margin-left: var(--space-1);
}

.campo--full select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
}

.campo--full select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.documentos {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
  margin-bottom: var(--space-5);
}

.documentos h3 {
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  display: inline-flex;
}

.documentos-subtitulo {
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  margin-bottom: var(--space-4);
}

.doc-item {
  margin-bottom: var(--space-3);
}

.doc-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  margin-bottom: var(--space-2);
  cursor: pointer;
}

.doc-check input[type='checkbox'] {
  width: 18px;
  height: 18px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.doc-upload {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: 26px;
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
  margin-left: 26px;
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

.doc-subido__quitar {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: var(--fs-md);
  cursor: pointer;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
}
</style>
