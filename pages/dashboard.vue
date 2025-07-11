<template>
  <v-card>
    <v-card-title class="text-h4 mb-4">Dashboard</v-card-title>
    <v-card-text>
      <p class="mb-4">Bem-vindo(a) ao painel administrativo.</p>
      <p class="text-body-1 text-grey-darken-1">
        Este sistema permite a gestão completa de insumos industriais, desde o cadastro de fornecedores e produtos até o controle de estoque, compras, recebimento, movimentação e análises de qualidade, buscando otimizar os processos e auxiliar na tomada de decisões estratégicas. Nossa solução visa oferecer um controle eficiente para as necessidades da sua empresa.
      </p>
    </v-card-text>

    <v-container>
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <FornecedorContador />
        </v-col>
        <v-col cols="12" md="6">
          <InsumosContador />
        </v-col>
      </v-row>

      <p class="text-h5 mb-4 text-accent">Ações Rápidas</p>
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-btn block color="accent" size="large" to="/fornecedores/cadastro">
            <v-icon start>mdi-account-plus</v-icon>
            Cadastrar Novo Fornecedor
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-btn block color="primary" size="large" to="/insumos/cadastro">
            <v-icon start>mdi-package-variant-plus</v-icon>
            Cadastrar Novo Insumo
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-btn block color="accent" size="large" to="/compras/pedidos">
            <v-icon start>mdi-cart-plus</v-icon>
            Gerenciar Pedidos de Compra
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
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

<style scoped>
.v-btn .v-icon {
  margin-right: 8px;
}
</style>