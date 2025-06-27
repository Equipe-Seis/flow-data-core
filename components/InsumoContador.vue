<template>
  <v-card class="pa-4 d-flex align-center" elevation="2" style="height: 100px;">
    <v-avatar color="primary" size="48" class="me-4">
      <v-icon icon="mdi-account-group" />
    </v-avatar>
    <div>
      <div class="text-subtitle-1">Total de Insumos</div>
      <div class="text-h5 font-weight-bold">{{ total }}</div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const total = ref(0)

onMounted(async () => {
  try {
    const { data } = await useFetch('/api/insumos')
    total.value = data.value?.length || 0
  } catch (err) {
    console.error('Erro ao buscar insumos:', err)
  }
})
</script>