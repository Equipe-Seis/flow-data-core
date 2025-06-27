<template>
  <v-container>
    <v-btn color="primary" class="mb-4" @click="goToCadastro">
      Novo Insumo
    </v-btn>

    <v-card>
      <v-card-title>Lista de Insumo</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="insumos"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            <v-btn size="small" color="primary" @click="editarInsumos(item.id)">
              Editar
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup async>
import { useRouter } from 'vue-router'

const router = useRouter()

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { data: insumos } = await useFetch('/api/insumos')

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Código', key: 'codigo' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Navegação
function goToCadastro() {
  router.push('/insumos/cadastro')
}

function editarInsumos(id) {
  router.push(`/insumos/${id}`)
}
</script>
