<template>
  <v-container>
    <v-row>
      <v-col>
        <div class="mt-10">
          <h1 class="text-h4 mb-4">Movimentação de Estoque</h1>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex justify-end ga-4 mt-10">
          <v-btn color="primary" @click="goToRegistration">
            Nova Movimentação
          </v-btn>
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
                v-model="numeroPedido"
                hide-details
                label="Número do Pedido"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field
                v-model="dataPedido"
                hide-details
                clearable
                type="date"
                label="Data do Pedido"
                variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-select
                v-model="origemPedido"
                hide-details
                clearable
                label="Origem do Pedido"
                :items="['PROD-01', 'PROD-02', 'PROD-03', 'Suprimentos']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="tipoInsumo"
                hide-details
                clearable
                label="Tipo do Insumo"
                :items="['Tipo 1', 'Tipo 2', 'Tipo 3']"
                multiple
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="4">
              <v-select
                v-model="statusPedido"
                clearable
                label="Status"
                :items="['Pendente', 'Aprovado', 'Rejeitado']"
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
          :items="pedidos"
          :items-per-page="5"
          class="elevation-1"
        >
          <template #pedido=""
            ><!--{ pedido }-->
            <tr class="d-none d-md-table-row">
              <td></td>
              <!--pedido.id-->
              <td></td>
              <!--pedido.dataPedido-->
              <td></td>
              <!--pedido.origem-->
              <td></td>
              <!--pedido.insumoList-->
              <td></td>
              <!--pedido.status-->
              <td>
                <v-btn
                  size="small"
                  color="primary"
                  icon="mdi-file-document-edit-outline"
                  title="Editar Movimentação"
                >
                </v-btn>
                <!--trocar por ícones-->
              </td>
            </tr>
          </template>

          <template #no-data>
            Nenhum pedido de movimentação encontrado.
          </template>
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

const headers = [
  { title: "Nº Pedido", key: "id" },
  { title: "Data do Pedido", key: "dataPedido" },
  { title: "Origem do Pedido", key: "origem" },
  { title: "Insumo(s)", key: "insumoList" },
  { title: "Status", key: "status" },
  { title: "Ações", key: "actions", sortable: false },
];

function goToRegistration() {
  router.push("/estoque/cadastro");
}

function editInventoryMovement(id) {
  router.push(`/estoque/${id}`);
}

const numeroPedido = ref("");
const dataPedido = ref("");
const origemPedido = ref([]);
const tipoInsumo = ref([]);
const statusPedido = ref([]);

onMounted(() => {
  numeroPedido.value = route.query.numeroPedido || "";
  dataPedido.value = route.query.dataPedido || "";
  origemPedido.value = route.query.origemPedido
    ? Array.isArray(route.query.origemPedido)
      ? route.query.origemPedido
      : [route.query.origemPedido]
    : [];
  tipoInsumo.value = route.query.tipoInsumo
    ? Array.isArray(route.query.tipoInsumo)
      ? route.query.tipoInsumo
      : [route.query.tipoInsumo]
    : [];
  statusPedido.value = route.query.statusPedido
    ? Array.isArray(route.query.statusPedido)
      ? route.query.statusPedido
      : [route.query.statusPedido]
    : [];
});

function applyFilters() {
  router.push({
    query: {
      numeroPedido: numeroPedido.value || undefined,
      dataPedido: dataPedido.value || undefined,
      origemPedido: origemPedido.value.length ? origemPedido.value : undefined,
      tipoInsumo: tipoInsumo.value.length ? tipoInsumo.value : undefined,
      status: statusPedido.value.length ? statusPedido.value : undefined,
    },
  });
}

function clearFilters() {
  numeroPedido.value = "";
  dataPedido.value = "";
  origemPedido.value = [];
  tipoInsumo.value = [];
  statusPedido.value = [];

  router.push({ query: {} });
}
</script>

<style></style>
