<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import EmpleadosTabla from '@/components/empleados/EmpleadosTabla.vue'
import ImportarExcelModal from '@/components/empleados/ImportarExcelModal.vue'
import CrearCuentaModal from '@/components/empleados/CrearCuentaModal.vue'
import EditarEmpleadoModal from '@/components/empleados/EditarEmpleadoModal.vue'
import { useEmpleadosLista } from '@/composables/useEmpleadosLista'
import { empleadosService } from '@/services/empleados.service'
import { usuariosService } from '@/services/usuarios.service'
import type { CrearCuentaPayload } from '@/services/usuarios.service'
import { alerta } from '@/services/alerta'
import { ApiError } from '@/services/http'
import type { Empleado } from '@/types/empleado'

const {
  empleados,
  busqueda,
  page,
  total,
  totalPages,
  cargando,
  cargar,
  aplicar,
  limpiar,
  irAPagina,
} = useEmpleadosLista()

const mostrarImportar = ref(false)
const importando = ref(false)

const cuentaEmpleado = ref<Empleado | null>(null)
const creandoCuenta = ref(false)

const editarEmpleado = ref<Empleado | null>(null)
const guardandoEdicion = ref(false)

onMounted(() => cargar(1))

/** Traduce el error del backend al mismo formato de alerta que ya usa la vista. */
async function mostrarError(titulo: string, e: unknown, fallback: string) {
  if (e instanceof ApiError) {
    await alerta.errorCodigo(titulo, e.message, e.code)
  } else {
    await alerta.error(titulo, fallback)
  }
}

async function importarExcel(archivo: File) {
  importando.value = true
  try {
    const res = await empleadosService.importarExcel(archivo)
    mostrarImportar.value = false
    await cargar(1)
    await alerta.exito('Importación completa', res.msg)
  } catch (e) {
    if (e instanceof ApiError) {
      await alerta.errorCodigo(
        'No se pudo importar el archivo',
        e.message,
        e.code,
      )
    } else {
      await alerta.error(
        'No se pudo importar el archivo',
        'Revisa que el formato y las columnas coincidan con la plantilla.',
      )
    }
  } finally {
    importando.value = false
  }
}

async function crearCuenta(payload: CrearCuentaPayload) {
  if (!cuentaEmpleado.value) return
  creandoCuenta.value = true
  try {
    await usuariosService.crear(cuentaEmpleado.value.id, payload)
    cuentaEmpleado.value = null
    await cargar(page.value)
    await alerta.exito('¡Registro guardado!', 'La información se guardó correctamente.')
  } catch (e) {
    await mostrarError('No se pudo crear la cuenta', e, 'Ocurrió un error inesperado.')
  } finally {
    creandoCuenta.value = false
  }
}

/**
 * Guarda la edicion del empleado. Son hasta tres endpoints distintos (foto,
 * datos de cuenta y contrasena), asi que se mandan en secuencia y solo los
 * que cambiaron. Si uno falla, se corta ahi y se avisa cual fue.
 */
async function guardarEdicion(cambios: {
  archivo?: File
  telefono?: string
  password?: string
}) {
  const empleado = editarEmpleado.value
  if (!empleado) return

  guardandoEdicion.value = true
  try {
    if (cambios.archivo) {
      await empleadosService.subirFoto(empleado.id, cambios.archivo)
    }
    if (cambios.telefono) {
      await usuariosService.editar(empleado.id, { telefono: cambios.telefono })
    }
    if (cambios.password) {
      await usuariosService.cambiarPassword(empleado.id, cambios.password)
    }

    editarEmpleado.value = null
    await cargar(page.value)
    await alerta.exito('¡Registro guardado!', 'La información se guardó correctamente.')
  } catch (e) {
    await mostrarError('No se pudo guardar la edición', e, 'Ocurrió un error inesperado.')
    // Recarga de todos modos: puede que la foto si haya subido y el celular no.
    await cargar(page.value)
  } finally {
    guardandoEdicion.value = false
  }
}
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1 class="page__title">Empleados</h1>
    </header>

    <div class="card">
      <div class="barra">
        <div class="barra__buscar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="barra__icon">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por número, nombre o apellido…"
            @keyup.enter="aplicar"
          />
        </div>

        <BaseButton variant="primary" @click="aplicar">Aplicar</BaseButton>
        <BaseButton variant="secondary" @click="limpiar">Cancelar</BaseButton>

        <BaseButton variant="primary" class="barra__importar" @click="mostrarImportar = true">
          <template #icon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <path d="M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </template>
          Importar empleados
        </BaseButton>
      </div>

      <EmpleadosTabla
        :empleados="empleados"
        :cargando="cargando"
        @crear-cuenta="cuentaEmpleado = $event"
        @editar="editarEmpleado = $event"
      />

      <footer v-if="total > 0" class="table-footer">
        <span class="conteo">Mostrando {{ empleados.length }} de {{ total }} registros</span>
        <BasePagination :page="page" :total-pages="totalPages" @change="irAPagina" />
      </footer>
    </div>

    <ImportarExcelModal
      v-if="mostrarImportar"
      :subiendo="importando"
      @subir="importarExcel"
      @close="mostrarImportar = false"
    />

    <CrearCuentaModal
      v-if="cuentaEmpleado"
      :empleado="cuentaEmpleado"
      :guardando="creandoCuenta"
      @registrar="crearCuenta"
      @close="cuentaEmpleado = null"
    />

    <EditarEmpleadoModal
      v-if="editarEmpleado"
      :empleado="editarEmpleado"
      :guardando="guardandoEdicion"
      @guardar="guardarEdicion"
      @close="editarEmpleado = null"
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
.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-5);
}
.barra {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}
.barra__buscar {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}
.barra__icon {
  position: absolute;
  left: var(--space-3);
  width: 18px;
  height: 18px;
  color: var(--color-text-muted);
}
.barra__buscar input {
  width: 100%;
  padding: var(--space-3) var(--space-3) var(--space-3) var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
}
.barra__importar { margin-left: auto; }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-5);
}
.conteo {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}
</style>
