<template>
  <v-container>
    <h1 class="text-h4 text-sm-h3 text-md-h2 mb-4">Cadastro de Insumos</h1>

    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="insumo.nome"
            label="Nome"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="insumo.codigo"
            label="Código"
            :rules="[v => !!v || 'Código é obrigatório']"
            required
          />
        </v-col>
      </v-row>

      <v-text-field
        label="Descrição"
        v-model="insumo.descricao"
        :rules="[v => !!v || 'Descrição é obrigatória']"
      ></v-text-field>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Quantidade mínima de estoque"
            v-model.number="insumo.quantidade"
            type="number"
            :rules="[
              v => v !== null && v !== '' || 'Quantidade é obrigatória',
              v => (v === null || v === '' || v >= 0) || 'Quantidade não pode ser negativa'
            ]"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Preço"
            v-model.number="insumo.preco"
            type="number"
            prefix="R$"
            :rules="[
              v => v !== null && v !== '' || 'Preço é obrigatório',
              v => (v === null || v === '' || v >= 0) || 'Preço não pode ser negativo'
            ]"
            required
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn color="primary" type="submit" class="mt-4" :loading="carregando">
        Cadastrar
      </v-btn>
      <v-btn color="secondary" class="mt-4 ms-2" @click="router.back()">
        Voltar
      </v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref(null);
const valid = ref(false);
const carregando = ref(false);
const erro = ref('');

const insumo = reactive({
  nome: '',
  descricao: '',
  codigo: '',
  quantidade: null,
  preco: null
});

const onSubmit = async () => {
  erro.value = '';
  carregando.value = true; 

  const { valid: isValid } = await form.value.validate();

  if (!isValid) {
    erro.value = 'Por favor, corrija os erros no formulário.';
    carregando.value = false; 
    return;
  }

  try {
    await $fetch('/api/insumos', {
      method: 'POST',
      body: { ...insumo },
    });
    router.push('/insumos/insumos'); 
  } catch (err) {
    console.error('Erro ao salvar insumo:', err); 
    erro.value = 'Erro ao salvar insumo. Tente novamente.';
  } finally {
    carregando.value = false; 
  }
};

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});
</script>

<style scoped>
</style>