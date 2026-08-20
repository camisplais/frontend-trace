<script setup lang="ts">
import { tipoClienteLabel, type Cliente } from '@/types/cliente'

defineProps<{
  clientes: Cliente[]
  indiceInicial: number
  cargando?: boolean
}>()

const emit = defineEmits<{
  editar: [cliente: Cliente]
  eliminar: [cliente: Cliente]
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>#</th>
        <th>Cliente</th>
        <th>Ciudad</th>
        <th>Tipo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(c, i) in clientes" :key="c.id">
        <td>{{ indiceInicial + i }}</td>
        <td>{{ c.nombre }}</td>
        <td>{{ c.ubicacion }}</td>
        <td>{{ tipoClienteLabel[c.tipo] }}</td>
        <td>
          <div class="acciones">
            <button class="accion accion--editar" aria-label="Editar" @click="emit('editar', c)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
              </svg>
            </button>
            <button class="accion accion--eliminar" aria-label="Eliminar" @click="emit('eliminar', c)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      <tr v-if="!cargando && clientes.length === 0">
        <td colspan="5" class="table__empty">No hay clientes para mostrar.</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table__empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-6);
}

.acciones {
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
