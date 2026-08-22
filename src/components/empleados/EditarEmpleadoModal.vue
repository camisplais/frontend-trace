<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { nombreCompleto, iniciales, type Empleado } from '@/types/empleado'
import { resolverImagenUrl } from '@/services/empleados.service'
import { usuariosService } from '@/services/usuarios.service'
import { validarCelular, validarPassword } from '@/types/usuario'

/**
 * Edicion del empleado desde el lapiz de la tabla: foto, celular y contrasena.
 * Los tres campos son opcionales; solo se emiten los que realmente cambiaron
 * para no disparar validaciones del backend de mas (ej. VAL_008 si mandas la
 * misma contrasena).
 */
const props = defineProps<{ empleado: Empleado; guardando?: boolean }>()

const emit = defineEmits<{
  close: []
  guardar: [cambios: { archivo?: File; telefono?: string; password?: string }]
}>()

const TIPOS = ['image/jpeg', 'image/png']

const archivo = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const telefono = ref('')
const telefonoOriginal = ref('')
const password = ref('')
const verPassword = ref(false)
const cargandoCuenta = ref(false)

const tieneCuenta = computed(() => !!props.empleado.cuenta)
const fotoActual = computed(() => resolverImagenUrl(props.empleado.imagen))

const errorTelefono = computed(() =>
  telefono.value && telefono.value !== telefonoOriginal.value
    ? validarCelular(telefono.value)
    : null,
)
const errorPassword = computed(() =>
  password.value ? validarPassword(password.value) : null,
)

const hayCambios = computed(
  () =>
    !!archivo.value ||
    (telefono.value !== telefonoOriginal.value && !!telefono.value) ||
    !!password.value,
)

const puedeGuardar = computed(
  () => hayCambios.value && !errorTelefono.value && !errorPassword.value && !props.guardando,
)

onMounted(async () => {
  // El listado de empleados solo trae { id, username } en `cuenta`, asi que el
  // celular actual hay que pedirlo aparte.
  if (!props.empleado.cuenta) return
  cargandoCuenta.value = true
  try {
    const usuario = await usuariosService.obtener(props.empleado.cuenta.id)
    telefono.value = usuario.celular ?? ''
    telefonoOriginal.value = usuario.celular ?? ''
  } catch {
    telefono.value = ''
    telefonoOriginal.value = ''
  } finally {
    cargandoCuenta.value = false
  }
})

function limpiarPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
}

function onInput(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file || !TIPOS.includes(file.type)) return
  limpiarPreview()
  archivo.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function guardar() {
  if (!puedeGuardar.value) return
  emit('guardar', {
    archivo: archivo.value ?? undefined,
    telefono:
      telefono.value && telefono.value !== telefonoOriginal.value
        ? telefono.value
        : undefined,
    password: password.value || undefined,
  })
}

onBeforeUnmount(limpiarPreview)
</script>

<template>
  <BaseModal title="Editar empleado" @close="emit('close')">
    <p class="subtitulo">{{ nombreCompleto(empleado) }} · No. {{ empleado.no_empleado }}</p>

    <div class="foto">
      <img v-if="previewUrl" :src="previewUrl" alt="Vista previa" class="foto__img" />
      <img v-else-if="fotoActual" :src="fotoActual" alt="Foto actual" class="foto__img" />
      <span v-else class="foto__placeholder">{{ iniciales(empleado) }}</span>

      <div class="foto__acciones">
        <BaseButton variant="secondary" @click="inputEl?.click()">
          {{ archivo ? 'Elegir otra' : 'Cambiar foto' }}
        </BaseButton>
        <span class="foto__nombre">{{ archivo?.name ?? 'JPG o PNG, máx 5MB' }}</span>
        <input
          ref="inputEl"
          type="file"
          accept="image/jpeg,image/png"
          class="input-oculto"
          @change="onInput"
        />
      </div>
    </div>

    <template v-if="tieneCuenta">
      <div class="campo">
        <label class="campo__label" for="editar-celular">Celular</label>
        <input
          id="editar-celular"
          v-model="telefono"
          type="tel"
          inputmode="numeric"
          maxlength="10"
          :placeholder="cargandoCuenta ? 'Cargando…' : '10 dígitos'"
          class="campo__input"
        />
        <p v-if="errorTelefono" class="campo__error">{{ errorTelefono }}</p>
      </div>

      <div class="campo">
        <label class="campo__label" for="editar-password">Nueva contraseña</label>
        <div class="campo__password">
          <input
            id="editar-password"
            v-model="password"
            :type="verPassword ? 'text' : 'password'"
            placeholder="Déjalo vacío para no cambiarla"
            class="campo__input"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="campo__ojo"
            :aria-label="verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="verPassword = !verPassword"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <path v-if="!verPassword" d="M3 3l18 18" />
            </svg>
          </button>
        </div>
        <p v-if="errorPassword" class="campo__error">{{ errorPassword }}</p>
        <p v-else class="campo__ayuda">Al menos una mayúscula y un carácter especial.</p>
      </div>
    </template>

    <p v-else class="aviso">
      Este empleado no tiene cuenta registrada, por eso solo puedes cambiar su foto.
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">Cancelar</BaseButton>
      <BaseButton variant="primary" :disabled="!puedeGuardar" @click="guardar">
        {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.subtitulo {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  margin-top: calc(var(--space-4) * -1);
  margin-bottom: var(--space-5);
}

.foto {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  margin-bottom: var(--space-5);
  border-bottom: 1px solid var(--color-border);
}
.foto__img,
.foto__placeholder {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  object-fit: cover;
}
.foto__placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  color: var(--color-text-muted);
  font-size: var(--fs-lg);
  font-weight: var(--fw-semibold);
}
.foto__acciones {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
}
.foto__nombre {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}
.input-oculto { display: none; }

.campo { margin-bottom: var(--space-4); }
.campo__label {
  display: block;
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: var(--space-2);
}
.campo__input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  color: var(--color-text);
  background-color: var(--color-surface);
}
.campo__input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.campo__password { position: relative; display: flex; align-items: center; }
.campo__password .campo__input { padding-right: var(--space-8); }
.campo__ojo {
  position: absolute;
  right: var(--space-3);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  display: inline-flex;
}
.campo__ojo svg { width: 18px; height: 18px; }
.campo__ayuda {
  margin-top: var(--space-1);
  font-size: var(--fs-xs);
  color: var(--color-text-faint);
}
.campo__error {
  margin-top: var(--space-1);
  font-size: var(--fs-xs);
  color: var(--color-danger);
}
.aviso {
  font-size: var(--fs-sm);
  color: var(--color-text-muted);
}
</style>
