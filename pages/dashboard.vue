<template>
  <v-card>
    <v-card-title>Dashboard</v-card-title>
    <v-card-text>Bem-vindo ao painel administrativo.</v-card-text>

    <FornecedorContador />
    <InsumosContador />
  </v-card>
</template>

<script setup>
import FornecedorContador from '~/components/FornecedorContador.vue'
import InsumosContador from '~/components/InsumoContador.vue'
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>
