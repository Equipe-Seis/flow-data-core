<template>
  <v-card class="pa-4 d-flex flex-wrap justify-center align-center" elevation="2">
    <v-avatar color="primary" size="48" class="me-4 mb-2 mb-sm-0">
      <v-icon icon="mdi-account-group" />
    </v-avatar>
    <div class="text-center">
      <div class="text-subtitle-1">Total de Fornecedores</div>
      <div class="text-h5 font-weight-bold">{{ total }}</div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const total = ref(0)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/fornecedores')
    total.value = data.value?.length || 0
  } catch (err) {
    console.error('Erro ao buscar fornecedores:', err)
  }
})
</script>

<style scoped>
</style>