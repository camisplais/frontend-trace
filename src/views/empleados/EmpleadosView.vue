<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import EmpleadosTabla from '@/components/empleados/EmpleadosTabla.vue'
import ImportarExcelModal from '@/components/empleados/ImportarExcelModal.vue'
import SubirFotoModal from '@/components/empleados/SubirFotoModal.vue'
import { useEmpleadosLista } from '@/composables/useEmpleadosLista'
import { empleadosService } from '@/services/empleados.service'
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

const fotoEmpleado = ref<Empleado | null>(null)
const subiendoFoto = ref(false)

onMounted(() => cargar(1))

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

async function subirFoto(archivo: File) {
  if (!fotoEmpleado.value) return
  subiendoFoto.value = true
  try {
    await empleadosService.subirFoto(fotoEmpleado.value.id, archivo)
    fotoEmpleado.value = null
    await cargar(page.value)
    await alerta.exito('Foto actualizada', 'La foto se guardó correctamente.')
  } catch (e) {
    if (e instanceof ApiError) {
      await alerta.errorCodigo('No se pudo subir la foto', e.message, e.code)
    } else {
      await alerta.error('No se pudo subir la foto', 'Ocurrió un error inesperado.')
    }
  } finally {
    subiendoFoto.value = false
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
        @editar-foto="fotoEmpleado = $event"
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

    <SubirFotoModal
      v-if="fotoEmpleado"
      :empleado="fotoEmpleado"
      :subiendo="subiendoFoto"
      @subir="subirFoto"
      @close="fotoEmpleado = null"
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
