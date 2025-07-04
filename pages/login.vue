<template>
  <div class="fluxdata-background">
    <div class="image-decor"></div>

    <v-container class="d-flex align-center justify-end login-container">
      <v-card
        max-width="500"
        width="100%"
        class="pa-8 rounded-lg elevation-0 custom-card"
      >
        <div class="text-center mb-6">
          <h1 class="text-h2 font-weight-bold" style="color: #26f964">FlowData</h1>
          <h2 class="text-h6 font-weight-bold" style="color: #26f964">Bem-vindo(a)!</h2>
        </div>

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="email"
            label="Usuário:"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="emailRules"
            required
          />
          <v-text-field
            v-model="password"
            label="Senha:"
            type="password"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="passwordRules"
            required
          />
          <v-checkbox
            v-model="remember"
            label="Lembre-se de mim."
            hide-details
            class="mb-4"
          />
          <v-btn
            :disabled="!valid"
            block
            size="large"
            class="text-white"
            style="background-color: #26f964;"
            @click="login"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card>
    </v-container>

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
const remember = ref(true)
const valid = ref(false)
const form = ref(null)

const dialog = ref(false)
const dialogMessage = ref('')

const emailRules = [
  v => !v ? 'E-mail é obrigatório' : true,
  v => !/.+@.+\..+/.test(v) ? 'E-mail inválido' : true
]

const passwordRules = [
  v => !v ? 'Senha é obrigatória' : true,
  v => v.length < 6 ? 'Senha deve ter no mínimo 6 caracteres' : true
]

async function login() {
  dialogMessage.value = ''
  dialog.value = false

  const { valid: formIsValid } = await form.value.validate()

  if (formIsValid) {
    const success = await tryLogin(email.value, password.value)
    if (success) {
      router.push('/dashboard')
    } else {
      dialogMessage.value = 'Credenciais inválidas.'
      dialog.value = true
    }
  }
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
.fluxdata-background {
  height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  background-color: white;
  flex-direction: row;
}

.image-decor {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50%;
  background-image: url('/icon.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center left;
  z-index: 1;
}

.login-container {
  height: 100vh;
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100%;
}

/* Card styling */
.custom-card {
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 3;
}

/* RESPONSIVIDADE */
@media (max-width: 960px) {
  .fluxdata-background {
    flex-direction: column;
    justify-content: center;
  }

  .image-decor {
    display: none;
  }

  .login-container {
    justify-content: center !important;
    padding: 24px;
  }

  .custom-card {
    max-width: 100% !important;
  }
}
</style>
