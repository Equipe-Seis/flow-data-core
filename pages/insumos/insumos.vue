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
          :items="insumos || []"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr class="d-none d-md-table-row">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td>{{ item.codigo }}</td>
              <td>{{ item.descricao }}</td>
              <td>
                <v-btn size="small" color="primary" @click="editarInsumos(item.id)">
                  Editar
                </v-btn>
              </td>
            </tr>

            <div class="d-md-none pa-2 my-2 border rounded">
              <div><strong>ID:</strong> {{ item.id }}</div>
              <div><strong>Nome:</strong> {{ item.nome }}</div>
              <div><strong>Código:</strong> {{ item.codigo }}</div>
              <div><strong>Descrição:</strong> {{ item.descricao }}</div>
              <div class="mt-2">
                <v-btn size="small" color="primary" @click="editarInsumos(item.id)" block>
                  Editar
                </v-btn>
              </div>
            </div>
          </template>

          <template #no-data>
            Nenhum insumo encontrado.
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

const { data: insumos } = await useFetch('/api/insumos', {
  default: () => []
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome', key: 'nome' },
  { title: 'Código', key: 'codigo' },
  { title: 'Descrição', key: 'descricao' },
  { title: 'Ações', key: 'actions', sortable: false },
]

function goToCadastro() {
  router.push('/insumos/cadastro')
}

function editarInsumos(id) {
  router.push(`/insumos/${id}`)
}
</script>

<style scoped>
.v-card-text .d-md-none + .d-md-none {
  margin-top: 8px;
}

.v-data-table .d-md-none {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.v-data-table .v-data-table__td {
  vertical-align: middle; 
}

@media (max-width: 959px) {
  .v-data-table > .v-data-table__wrapper > table > thead {
    display: none;
  }
}
</style>