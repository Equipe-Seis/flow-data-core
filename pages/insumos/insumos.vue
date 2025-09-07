<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Insumos</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToCadastro"> Novo Insumo </v-btn>
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
                hide-details
                label="Nome"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                hide-details
                clearable
                label="Tipo de Insumo"
                :items="['', '', '']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-select
                clearable
                label="Fornecedor"
                :items="['Forcedor 1', 'Fornecedor 2']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                hide-details
                label="Código"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
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
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  @click="editarInsumos(item.id)"
                  title="Editar Insumo"
                >
                </v-btn>
              </td>
            </tr>

            <div class="d-md-none pa-2 my-2 border rounded">
              <div><strong>ID:</strong> {{ item.id }}</div>
              <div><strong>Nome:</strong> {{ item.nome }}</div>
              <div><strong>Código:</strong> {{ item.codigo }}</div>
              <div><strong>Descrição:</strong> {{ item.descricao }}</div>
              <div class="mt-2">
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  @click="editarInsumos(item.id)"
                  title="Editar Insumo"
                >
                </v-btn>
              </div>
            </div>
          </template>

          <template #no-data> Nenhum insumo encontrado. </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted } from "vue";


const router = useRouter();
const route = useRoute();

definePageMeta({
  layout: "default",
  middleware: "auth",
});

const { data: insumos } = await useFetch("/api/insumos", {
  default: () => [],
});

const headers = [
  { title: "ID", key: "id" },
  { title: "Nome", key: "nome" },
  { title: "Código", key: "codigo" },
  { title: "Descrição", key: "descricao" },
  { title: "Ações", key: "actions", sortable: false },
];

function goToCadastro() {
  router.push("/insumos/cadastro");
}

function editarInsumos(id) {
  router.push(`/insumos/${id}`);
}

const nomeInsumo = ref("");
const codigoInsumo = ref("");
const tipoInsumo = ref([]);
const fornecedor = ref([]);
const statusInsumo = ref([]);

onMounted(() => {
  nomeInsumo.value = route.query.nomeInsumo || "";
  codigoInsumo.value = route.query.codigoInsumo || "";
  tipoInsumo.value = route.query.tipoInsumo
    ? Array.isArray(route.query.tipoInsumo)
      ? route.query.tipoInsumo
      : [route.query.tipoInsumo]
    : [];
  fornecedor.value = route.query.fornecedor
    ? Array.isArray(route.query.fornecedor)
      ? route.query.fornecedor
      : [route.query.fornecedor]
    : [];
  statusInsumo.value = route.query.statusInsumo
    ? Array.isArray(route.query.statusInsumo)
      ? route.query.statusInsumo
      : [route.query.statusInsumo]
    : [];
});

function applyFilters() {
  router.push({
    query: {
      nomeInsumo: nomeInsumo.value || undefined,
      codigoInsumo: codigoInsumo.value || undefined,
      tipoInsumo: tipoInsumo.value.length ? tipoInsumo.value : undefined,
      fornecedor: fornecedor.value.length ? fornecedor.value : undefined,
      statusInsumo: statusInsumo.value.length ? statusInsumo.value : undefined,
    },
  });
}

function clearFilters() {
  nomeInsumo.value = "";
  codigoInsumo.value = "";
  tipoInsumo.value = "";
  fornecedor.value = [];
  statusInsumo.value = [];

  router.push({ query: {} });
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
