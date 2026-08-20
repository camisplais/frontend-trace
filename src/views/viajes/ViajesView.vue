<script setup lang="ts">
import { onMounted } from 'vue'
import { useViajes } from '@/composables/useViajes'
import ViajesTabla from '@/components/viajes/ViajesTabla.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { viajes, page, totalPages, cargando, error, cargar, irAPagina } = useViajes()

onMounted(cargar)

const hoyLegible = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long' })
</script>

<template>
  <div class="viajes">
    <header class="viajes__header">
      <h1>Viajes</h1>
    </header>

    <section class="viajes__card">
      <div class="viajes__toolbar">
        <h2>Viajes registrados — {{ hoyLegible }}</h2>
        <BaseButton>+ Crear viaje</BaseButton>
      </div>

      <p v-if="error" class="viajes__error">{{ error }}</p>

      <ViajesTabla :viajes="viajes" :cargando="cargando" />

      <BasePagination v-if="totalPages > 1" :page="page" :total-pages="totalPages" @change="irAPagina" />
    </section>
  </div>
</template>

<style scoped>
.viajes__toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
.viajes__error { color: var(--color-danger); margin-bottom: var(--space-3); }
</style>
