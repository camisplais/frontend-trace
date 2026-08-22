<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { nombreCompleto, iniciales, type Empleado } from '@/types/empleado'
import { usuariosService } from '@/services/usuarios.service'
import { usernameSugerido, validarPassword, type Rol } from '@/types/usuario'
import type { CrearCuentaPayload } from '@/services/usuarios.service'

/**
 * Alta de cuenta para un empleado que aun no tiene acceso al sistema.
 * Solo arma y valida el formulario; emite `registrar` con el payload.
 */
const props = defineProps<{ empleado: Empleado; guardando?: boolean }>()

const emit = defineEmits<{
  close: []
  registrar: [payload: CrearCuentaPayload]
}>()

const roles = ref<Rol[]>([])
const cargandoRoles = ref(false)
const errorRoles = ref(false)
const rolId = ref<number | null>(null)
const password = ref('')
const verPassword = ref(false)
const tocado = ref(false)

// El backend exige que el username sea exactamente este, por eso va en solo
// lectura: si el coordinador lo edita libremente, el alta truena con VAL_010.
const username = computed(() => usernameSugerido(props.empleado))

const errorPassword = computed(() =>
  password.value ? validarPassword(password.value) : null,
)

const puedeRegistrar = computed(
  () => !!rolId.value && !!password.value && !errorPassword.value && !props.guardando,
)

onMounted(async () => {
  cargandoRoles.value = true
  try {
    roles.value = await usuariosService.listarRoles()
    // Preselecciona el rol que coincide con el puesto del empleado.
    const puesto = props.empleado.puesto?.trim().toLowerCase()
    rolId.value =
      roles.value.find((r) => r.nombre.trim().toLowerCase() === puesto)?.id ?? null
  } catch {
    // Sin roles no se puede dar de alta: el backend exige rol_id.
    roles.value = []
    errorRoles.value = true
  } finally {
    cargandoRoles.value = false
  }
})

function registrar() {
  tocado.value = true
  if (!puedeRegistrar.value) return
  emit('registrar', {
    username: username.value,
    password: password.value,
    rol_id: rolId.value!,
  })
}
</script>

<template>
  <BaseModal title="Crear cuenta de usuario" @close="emit('close')">
    <p class="subtitulo">Acceso al sistema TRACE</p>

    <div class="empleado">
      <span class="empleado__avatar">{{ iniciales(empleado) }}</span>
      <div>
        <p class="empleado__nombre">{{ nombreCompleto(empleado) }}</p>
        <p class="empleado__meta">No. Empleado {{ empleado.no_empleado }}</p>
      </div>
    </div>

    <div class="campo">
      <label class="campo__label" for="cuenta-username">Usuario</label>
      <input id="cuenta-username" :value="username" type="text" readonly class="campo__input campo__input--readonly" />
      <p class="campo__ayuda">Se genera con la inicial del nombre y los apellidos.</p>
    </div>

    <div class="campo">
      <label class="campo__label" for="cuenta-rol">Rol / Permiso</label>
      <select id="cuenta-rol" v-model="rolId" class="campo__input" :disabled="cargandoRoles">
        <option :value="null" disabled>
          {{ cargandoRoles ? 'Cargando roles…' : 'Selecciona un rol' }}
        </option>
        <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.nombre }}</option>
      </select>
      <p v-if="errorRoles" class="campo__error">
        No se pudieron cargar los roles. Recarga la página e inténtalo de nuevo.
      </p>
      <p v-else-if="tocado && !rolId" class="campo__error">Selecciona un rol.</p>
    </div>

    <div class="campo">
      <label class="campo__label" for="cuenta-password">Contraseña</label>
      <div class="campo__password">
        <input
          id="cuenta-password"
          v-model="password"
          :type="verPassword ? 'text' : 'password'"
          placeholder="Mínimo 8 caracteres"
          class="campo__input"
          autocomplete="new-password"
          @keyup.enter="registrar"
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

    <template #footer>
      <BaseButton variant="secondary" @click="emit('close')">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </template>
        Cancelar
      </BaseButton>
      <BaseButton variant="primary" :disabled="!puedeRegistrar" @click="registrar">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </template>
        {{ guardando ? 'Registrando…' : 'Registrar' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.subtitulo {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  margin-top: calc(var(--space-4) * -1);
  margin-bottom: var(--space-4);
}

.empleado {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-5);
}
.empleado__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
}
.empleado__nombre {
  font-weight: var(--fw-semibold);
  color: var(--color-text);
  font-size: var(--fs-sm);
}
.empleado__meta {
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
}

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
.campo__input--readonly {
  background-color: var(--color-bg);
  color: var(--color-text-muted);
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
</style>
