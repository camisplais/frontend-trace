<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.cargarUsuario()
})
</script>

<template>
  <div v-if="authStore.cargando" class="cargando-global">
    Cargando...
  </div>
  <RouterView v-else />
</template>