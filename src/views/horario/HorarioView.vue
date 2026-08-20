<script setup lang="ts">
import { onMounted } from 'vue'
import { useHorario } from '@/composables/useHorario'
import HorarioTabla from '@/components/horario/HorarioTabla.vue'
import BasePagination from '@/components/ui/BasePagination.vue'

const { embarques, busqueda, page, totalPages, cargando, error, cargar, irAPagina } = useHorario()

onMounted(cargar)

const hoyLegible = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long' })
</script>

<template>
  <div class="horario">
    <header class="horario__header">
      <h1>Horario</h1>
    </header>

    <section class="horario__card">
      <div class="horario__toolbar">
        <h2>Embarques del día — {{ hoyLegible }}</h2>
        <input v-model="busqueda" type="search" placeholder="Buscar cliente" class="horario__buscar" />
      </div>

      <p v-if="error" class="horario__error">{{ error }}</p>

      <HorarioTabla :embarques="embarques" :cargando="cargando" />

      <BasePagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @change="irAPagina" />
    </section>
  </div>
</template>

<style scoped>
.horario__toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.horario__buscar { padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border-strong); border-radius: var(--radius-sm); }
.horario__error { color: var(--color-danger); margin-bottom: var(--space-3); }
</style>
