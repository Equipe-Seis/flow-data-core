<template>
  <v-container>
    <v-btn color="primary" class="mb-4" @click="goToCadastro">
      Novo Fornecedor
    </v-btn>

    <v-card>
      <v-card-title>Lista de Fornecedores</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="fornecedores"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item.cnpj="{ item }">
            <span>
              {{ item.tipoPessoa === 'Física' ? item.cpf :item.cnpj}}
            </span>
          </template>
        
          <template #item.actions="{ item }">
            <v-btn size="small" color="primary" @click="editarFornecedor(item.id)">
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

// Busca fornecedores
const { data: fornecedores } = await useFetch('/api/fornecedores')

// Cabeçalhos da tabela
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome / Razão Social', key: 'nome' },
  { title: 'Tipo Pessoa', key: 'tipoPessoa' },
  { title: 'CNPJ / CPF', key: 'cnpj' },
  { title: 'Telefone', key: 'telefone' },
  { title: 'Ações', key: 'actions', sortable: false },
]

// Navegação
function goToCadastro() {
  router.push('/fornecedores/cadastro')
}

function editarFornecedor(id) {
  router.push(`/fornecedores/${id}`)
}
</script>
