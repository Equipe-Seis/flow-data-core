<template>
  <div class="fluxdata-background">
    <v-container class="d-flex align-center justify-center" style="height: 100vh;">
      <v-card max-width="400" width="100%" class="pa-6 rounded-lg elevation-8 custom-card">
        <v-card-title class="text-h5 text-center mb-4">
          <v-icon color="primary" class="mr-2">mdi-chart-bar</v-icon>
          Login - FluxData
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="email"
              label="E-mail"
              type="email"
              :rules="emailRules"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            />
            <v-text-field
              v-model="password"
              label="Senha"
              type="password"
              :rules="passwordRules"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              density="comfortable"
              required
              class="mb-3"
            />
            <v-btn
              :disabled="!valid"
              color="primary"
              block
              class="mt-4"
              size="large"
              @click="login"
            >
              Entrar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            Alerta
            <v-btn icon @click="dialog = false" size="small">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            {{ dialogMessage }}
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="dialog = false">Ok</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { login: tryLogin } = useAuth()

const email = ref('')
const password = ref('')
const valid = ref(false)
const form = ref(null)

const dialog = ref(false)
const dialogMessage = ref('')

const emailRules = [
  v => {
    if (!v) {
      return 'E-mail é obrigatório';
    }
    return true;
  },
  v => {
    if (!/.+@.+\..+/.test(v)) {
      return 'E-mail inválido';
    }
    return true;
  }
]

const passwordRules = [
  v => {
    if (!v) {
      return 'Senha é obrigatória';
    }
    return true;
  },
  v => {
    if (v.length < 6) {
      return 'Senha deve ter no mínimo 6 caracteres';
    }
    return true;
  }
]

async function login() {
  dialogMessage.value = '';
  dialog.value = false;

  const { valid: formIsValid } = await form.value.validate();

  if (formIsValid) {
    const success = await tryLogin(email.value, password.value);
    if (success) {
      router.push('/dashboard');
    } else {
      dialogMessage.value = 'Credenciais inválidas.';
      dialog.value = true;
    }
  }
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
.fluxdata-background {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #2a3a5c 0%, #4a6fa5 50%, #7c9eb2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.fluxdata-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at top left, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.7;
  pointer-events: none;
}

.custom-card {
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>