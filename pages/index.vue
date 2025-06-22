<!-- pages/index.vue -->
<template>
  <v-card class="mx-auto" max-width="400" outlined>
    <v-card-title>Bem-vindo</v-card-title>
    <v-card-text>
      Esta é uma aplicação Nuxt 3 com Vuetify 3.
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="sayHello">Clique aqui</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
function sayHello() {
  alert('Olá do Nuxt + Vuetify!')
}
</script>