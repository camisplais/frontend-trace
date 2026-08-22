<script setup lang="ts">
import {
  departamentoLabel,
  nombreCompleto,
  iniciales,
  type Empleado,
} from '@/types/empleado'
import { resolverImagenUrl } from '@/services/empleados.service'

defineProps<{
  empleados: Empleado[]
  cargando?: boolean
}>()

const emit = defineEmits<{
  'crear-cuenta': [empleado: Empleado]
  editar: [empleado: Empleado]
}>()
</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th>No. Empleado</th>
        <th>Nombre</th>
        <th>Departamento</th>
        <th>Puesto</th>
        <th>Foto</th>
        <th>Cuenta</th>
        <th aria-label="Acciones"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="e in empleados" :key="e.id">
        <td class="table__strong">{{ e.no_empleado }}</td>
        <td>{{ nombreCompleto(e) }}</td>
        <td>{{ departamentoLabel[e.departamento] ?? e.departamento }}</td>
        <td>{{ e.puesto }}</td>
        <td>
          <img
            v-if="resolverImagenUrl(e.imagen)"
            :src="resolverImagenUrl(e.imagen)!"
            :alt="`Foto de ${e.nombre}`"
            class="avatar avatar--img"
          />
          <span v-else class="avatar" aria-hidden="true">{{ iniciales(e) }}</span>
        </td>
        <td>
          <span v-if="e.cuenta" class="cuenta cuenta--activa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ e.cuenta.username }}
          </span>
          <!--
            Sin cuenta: el icono de usuario con "+" es el disparador del alta,
            para que se entienda que ahi se agrega el acceso al sistema.
          -->
          <button
            v-else
            type="button"
            class="cuenta cuenta--sin"
            :aria-label="`Crear cuenta para ${nombreCompleto(e)}`"
            @click="emit('crear-cuenta', e)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
            Sin cuenta registrada
          </button>
        </td>
        <td class="table__acciones">
          <button
            class="icono-btn"
            aria-label="Editar empleado"
            @click="emit('editar', e)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
        </td>
      </tr>
      <tr v-if="!cargando && empleados.length === 0">
        <td colspan="7" class="table__empty">No hay empleados registrados.</td>
      </tr>
      <tr v-if="cargando">
        <td colspan="7" class="table__empty">Cargando empleados…</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-sm);
  color: var(--color-text);
  vertical-align: middle;
}
.table tbody tr:last-child td { border-bottom: none; }
.table__strong { font-weight: var(--fw-semibold); }
.table__empty { text-align: center; color: var(--color-text-muted); padding: var(--space-6); }
.table__acciones { text-align: right; }

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  object-fit: cover;
}
.avatar--img { padding: 0; }

.cuenta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--fs-sm);
}
.cuenta svg { width: 16px; height: 16px; }
.cuenta--activa { color: var(--color-text); }
.cuenta--sin {
  background: transparent;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--color-primary);
  cursor: pointer;
  text-align: left;
}
.cuenta--sin:hover { color: var(--color-primary-hover); text-decoration: underline; }
.cuenta--sin svg {
  width: 20px;
  height: 20px;
  padding: 2px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-soft);
  flex-shrink: 0;
}

.icono-btn {
  background: var(--color-bg);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  color: var(--color-text-muted);
}
.icono-btn:hover { color: var(--color-primary); }
.icono-btn svg { width: 16px; height: 16px; display: block; }
</style>
