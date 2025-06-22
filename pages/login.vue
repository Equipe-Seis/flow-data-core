<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card max-width="400" width="100%" class="pa-4">
      <v-card-title class="text-h6 justify-center">Login</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            :rules="emailRules"
            prepend-icon="mdi-email"
            required
          />
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            :rules="passwordRules"
            prepend-icon="mdi-lock"
            required
          />
          <v-btn
            :disabled="!valid"
            color="primary"
            block
            class="mt-4"
            @click="login"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
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

const emailRules = [
  v => !!v || 'E-mail é obrigatório',
  v => /.+@.+\..+/.test(v) || 'E-mail inválido'
]

const passwordRules = [
  v => !!v || 'Senha é obrigatória',
  v => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
]

function login() {
  if (form.value?.validate()) {
    const success = tryLogin(email.value, password.value)
    if (success) {
      router.push('/dashboard')
    } else {
      alert('Credenciais inválidas!')
    }
  }
}

definePageMeta({
  layout: false // sem layout
})
</script>