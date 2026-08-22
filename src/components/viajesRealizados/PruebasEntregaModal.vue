<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { pruebaEntregaService, type PruebaEntrega } from '@/services/pruebaEntrega.service'
import { ApiError } from '@/services/http'
import { alerta } from '@/services/alerta'

const props = defineProps<{ embarqueId: number }>()
const emit = defineEmits<{ close: [] }>()

const pruebas = ref<PruebaEntrega[]>([])
const cargando = ref(false)

onMounted(async () => {
  cargando.value = true
  try {
    pruebas.value = await pruebaEntregaService.porEmbarque(props.embarqueId)
  } catch (e) {
    if (e instanceof ApiError) alerta.error(e.code, e.message)
    else alerta.error('Error', 'No se pudieron cargar las pruebas de entrega.')
    emit('close')
  } finally {
    cargando.value = false
  }
})

function nombreArchivo(url: string): string {
  try {
    const partes = new URL(url).pathname.split('/')
    return decodeURIComponent(partes[partes.length - 1] ?? 'archivo')
  } catch {
    return 'archivo'
  }
}
</script>

<template>
  <BaseModal title="Pruebas de entrega" @close="emit('close')">
    <p v-if="cargando">Cargando…</p>
    <ul v-else-if="pruebas.length" class="lista-pruebas">
      <li v-for="p in pruebas" :key="p.id">
        <a :href="p.url" target="_blank" rel="noopener">{{ nombreArchivo(p.url) }}</a>
      </li>
    </ul>
    <p v-else class="sin-pruebas">Sin documentos.</p>
  </BaseModal>
</template>

<style scoped>
.lista-pruebas { display: flex; flex-direction: column; gap: var(--space-2); }
.lista-pruebas a { color: var(--color-info-text); font-size: var(--fs-sm); }
.sin-pruebas { color: var(--color-text-faint); font-size: var(--fs-sm); }
</style>
