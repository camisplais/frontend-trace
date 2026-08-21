<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCrearViaje } from '@/composables/useCreateViaje'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const {
  transportes, choferes, embarques,
  embarqueId, transporteId, choferId, hora,
  documentos, archivosPorDoc, subidoPorDoc,
  cargandoOpciones, cargandoDocs, enviando, error,
  cargarOpciones, elegirArchivo, subirDocumento, generarViaje,
} = useCrearViaje()

onMounted(cargarOpciones)

// Qué documentos decidió incluir el usuario (checkbox). Por default, todos
// los que regresa el backend vienen marcados porque son "requeridos" para
// este cliente — el usuario puede desmarcar los que no aplican para este viaje.
const seleccionados = reactive<Record<number, boolean>>({})

watch(documentos, (docs) => {
  for (const doc of docs) {
    seleccionados[doc.doc_cliente_id] = false
  }
})

watch(embarqueId, (id) => {
  const seleccionado = embarques.value.find((e) => e.id === id)
  if (seleccionado?.hora) {
    // El backend manda "14:10:00", pero <input type="time"> espera "HH:mm"
    hora.value = seleccionado.hora.slice(0, 5)
  } else {
    hora.value = ''
  }
})

async function onSubmit() {
  const ok = await generarViaje()
  if (ok) router.push({ name: 'viajes' })
}

function onFileChange(docId: number, event: Event) {
  const input = event.target as HTMLInputElement
  elegirArchivo(docId, input.files?.[0] ?? null)
}

// "Deshacer" un archivo ya subido, para volver a mostrar el área de carga
function quitarArchivo(docId: number) {
  subidoPorDoc.value[docId] = false
  archivosPorDoc.value[docId] = null
}
</script>

<template>
  <div class="crear-viaje">
    <button class="volver" type="button" @click="router.push({ name: 'viajes' })">
      ← Volver a Viajes
    </button>

    <section class="card">
      <h2>Información del viaje</h2>
      <p class="subtitulo">Completa los datos del transporte, chofer y documentos de entrega.</p>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="grid">
        <div class="campo">
          <label>Embarque <span class="requerido">Requerido</span></label>
          <select v-model.number="embarqueId" :disabled="cargandoOpciones">
            <option :value="null" disabled>Seleccionar embarque</option>
            <option v-for="e in embarques" :key="e.id" :value="e.id">
              {{ e.plan_embarque }} — {{ e.cliente.nombre }}
            </option>
          </select>
        </div>

        <div class="campo">
          <label>Transporte <span class="requerido">Requerido</span></label>
          <select v-model.number="transporteId" :disabled="cargandoOpciones">
            <option :value="null" disabled>Seleccionar transporte</option>
            <option v-for="t in transportes" :key="t.id" :value="t.id">{{ t.placas }}</option>
          </select>
        </div>

        <div class="campo">
          <label>Chofer <span class="requerido">Requerido</span></label>
          <select v-model.number="choferId" :disabled="cargandoOpciones">
            <option :value="null" disabled>Seleccionar chofer</option>
            <option v-for="c in choferes" :key="c.id" :value="c.id">
              {{ c.nombre }} {{ c.apellido_paterno }}
            </option>
          </select>
        </div>

        <div class="campo">
          <label>Hora de embarque</label>
          <input v-model="hora" type="time" />
        </div>
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
            <!-- Ya se subió: fila verde con palomita y opción de quitar -->
            <div v-if="subidoPorDoc[doc.doc_cliente_id]" class="doc-subido">
              <span class="doc-subido__icono">✓</span>
              <span class="doc-subido__nombre">{{ archivosPorDoc[doc.doc_cliente_id]?.name }}</span>
              <button type="button" class="doc-subido__quitar" @click="quitarArchivo(doc.doc_cliente_id)">×</button>
            </div>
            <!-- Aún no se sube: input de archivo + botón Subir -->
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
          {{ enviando ? 'Generando…' : '→ Generar viaje' }}
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.crear-viaje {
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

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4) var(--space-6);
  margin-bottom: var(--space-5);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.campo label {
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

.campo select,
.campo input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
}

.campo select:focus,
.campo input:focus {
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

/* Área de subida: caja punteada, igual al diseño de Figma */
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

/* Fila de "ya subido": verde con palomita */
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

.error {
  color: var(--color-danger);
  background-color: var(--color-expedito-bg);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  margin-bottom: var(--space-4);
}
</style>
