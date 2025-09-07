<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Fornecedores</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToCadastro"> Novo Fornecedor </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>Filtros</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="nomeFornecedor"
                hide-details
                label="Nome"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="tipoFornecedor"
                hide-details
                clearable
                label="Tipo de Fornecedor"
                :items="['Pessoa Física', 'Pessoa Jurídica']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="cnpj"
                hide-details
                label="CNPJ"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="codigoFornecedor"
                hide-details
                label="Código"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="statusFornecedor"
                clearable
                label="Status"
                :items="['Ativo', 'Inativo']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>

          <div class="d-flex justify-start ga-4">
            <v-btn color="primary" @click.prevent="applyFilters">
              Pesquisar
            </v-btn>
            <v-btn class="me-2" @click.prevent="clearFilters"> Limpar </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="mt-4">
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
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  @click="editarFornecedor(item.id)"
                  title="Editar Fornecedor"
                >
                </v-btn>
              </td>
            </tr>

            <div class="d-md-none pa-2 my-2 border rounded">
              <div><strong>ID:</strong> {{ item.id }}</div>
              <div><strong>Nome/Razão Social:</strong> {{ item.nome }}</div>
              <div><strong>Tipo Pessoa:</strong> {{ item.tipoPessoa }}</div>
              <div>
                <strong>CNPJ/CPF:</strong> {{ item.documentoIdentificacao }}
              </div>
              <div><strong>Telefone:</strong> {{ item.telefone }}</div>
              <div class="mt-2">
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  @click="editarFornecedor(item.id)"
                  title="Editar Fornecedor"
                >
                </v-btn>
              </div>
            </div>
          </template>

          <template #no-data> Nenhum fornecedor encontrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { data: fornecedores } = await useFetch("/api/fornecedores", {
  default: () => [],
});

const fornecedoresFormatados = computed(() => {
  return (fornecedores.value || []).map((forn) => {
    let documento = "";
    if (forn.tipoPessoa === "Física" && forn.cpf) {
      documento = forn.cpf.replace(
        /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
        "$1.$2.$3-$4"
      );
    } else if (forn.tipoPessoa === "Jurídica" && forn.cnpj) {
      documento = forn.cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
    }

    let telefoneFormatado = forn.telefone;
    if (forn.telefone) {
      const telLimpo = forn.telefone.replace(/\D/g, "");
      if (telLimpo.length === 11) {
        telefoneFormatado = `(${telLimpo.substring(0, 2)}) ${telLimpo.substring(
          2,
          7
        )}-${telLimpo.substring(7, 11)}`;
      } else if (telLimpo.length === 10) {
        telefoneFormatado = `(${telLimpo.substring(0, 2)}) ${telLimpo.substring(
          2,
          6
        )}-${telLimpo.substring(6, 10)}`;
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
  { title: "ID", key: "id" },
  { title: "Nome / Razão Social", key: "nome" },
  { title: "Tipo Pessoa", key: "tipoPessoa" },
  { title: "CNPJ / CPF", key: "documentoIdentificacao" },
  { title: "Telefone", key: "telefone" },
  { title: "Ações", key: "actions", sortable: false },
];

function goToCadastro() {
  router.push("/fornecedores/cadastro");
}

function editarFornecedor(id) {
  router.push(`/fornecedores/${id}`);
}

const nomeFornecedor = ref("");
const cnpj = ref("");
const codigoFornecedor = ref("");
const tipoFornecedor = ref([]);
const statusFornecedor = ref([]);

onMounted(() => {
  nomeFornecedor.value = route.query.nomeFornecedor || "";
  cnpj.value = route.query.cnpj || "";
  codigoFornecedor.value = route.query.codigoFornecedor || "";
  tipoFornecedor.value = route.query.tipoFornecedor
    ? Array.isArray(route.query.tipoFornecedor)
      ? route.query.tipoFornecedor
      : [route.query.tipoFornecedor]
    : [];
  statusFornecedor.value = route.query.statusFornecedor
    ? Array.isArray(route.query.statusFornecedor)
      ? route.query.statusFornecedor
      : [route.query.statusFornecedor]
    : [];
});

function applyFilters() {
  router.push({
    query: {
      nomeFornecedor: nomeFornecedor.value || undefined,
      cnpj: cnpj.value || undefined,
      codigoFornecedor: codigoFornecedor.value || undefined,
      tipoFornecedor: tipoFornecedor.value.length
        ? tipoFornecedor.value
        : undefined,
      statusFornecedor: statusFornecedor.value.length
        ? statusFornecedor.value
        : undefined,
    },
  });
}

function clearFilters() {
  nomeFornecedor.value = "";
  cnpj.value = "";
  codigoFornecedor.value = "";
  tipoFornecedor.value = [];
  statusFornecedor.value = [];

  router.push({ query: {} });
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
