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
          :items="fornecedoresFormatados"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr class="d-none d-md-table-row">
              <td>{{ item.id }}</td>
              <td>{{ item.nome }}</td>
              <td>{{ item.tipoPessoa }}</td>
              <td>{{ item.documentoIdentificacao }}</td>
              <td>{{ item.telefone }}</td>
              <td>
                <v-btn size="small" color="primary" @click="editarFornecedor(item.id)">
                  Editar
                </v-btn>
              </td>
            </tr>

            <div class="d-md-none pa-2 my-2 border rounded">
              <div><strong>ID:</strong> {{ item.id }}</div>
              <div><strong>Nome/Razão Social:</strong> {{ item.nome }}</div>
              <div><strong>Tipo Pessoa:</strong> {{ item.tipoPessoa }}</div>
              <div><strong>CNPJ/CPF:</strong> {{ item.documentoIdentificacao }}</div>
              <div><strong>Telefone:</strong> {{ item.telefone }}</div>
              <div class="mt-2">
                <v-btn size="small" color="primary" @click="editarFornecedor(item.id)" block>
                  Editar
                </v-btn>
              </div>
            </div>
          </template>

          <template #no-data>
            Nenhum fornecedor encontrado.
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

const { data: fornecedores } = await useFetch('/api/fornecedores', {
  default: () => []
});

const fornecedoresFormatados = computed(() => {
  return (fornecedores.value || []).map(forn => {
    let documento = '';
    if (forn.tipoPessoa === 'Física' && forn.cpf) {
      documento = forn.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else if (forn.tipoPessoa === 'Jurídica' && forn.cnpj) {
      documento = forn.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }

    let telefoneFormatado = forn.telefone;
    if (forn.telefone) {
      const telLimpo = forn.telefone.replace(/\D/g, '');
      if (telLimpo.length === 11) {
        telefoneFormatado = `(${telLimpo.substring(0, 2)}) ${telLimpo.substring(2, 7)}-${telLimpo.substring(7, 11)}`;
      } else if (telLimpo.length === 10) {
        telefoneFormatado = `(${telLimpo.substring(0, 2)}) ${telLimpo.substring(2, 6)}-${telLimpo.substring(6, 10)}`;
      }
    }

    return {
      ...forn,
      documentoIdentificacao: documento,
      telefone: telefoneFormatado,
    };
  });
});

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nome / Razão Social', key: 'nome' },
  { title: 'Tipo Pessoa', key: 'tipoPessoa' },
  { title: 'CNPJ / CPF', key: 'documentoIdentificacao' },
  { title: 'Telefone', key: 'telefone' },
  { title: 'Ações', key: 'actions', sortable: false },
];

function goToCadastro() {
  router.push('/fornecedores/cadastro');
}

function editarFornecedor(id) {
  router.push(`/fornecedores/${id}`);
}
</script>

<style scoped>
.v-data-table .d-md-none {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12); 
}
.v-data-table .v-data-table__td {
  vertical-align: middle; 
}
</style>