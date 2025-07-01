<template>
  <v-container>
    <h1>Editar Insumo</h1>

        <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
          <v-text-field
            v-model="insumo.nome"
            label="Nome"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          />

          <v-text-field
            v-model="insumo.codigo"
            label="Código"
            :rules="[v => !!v || 'Código é obrigatório']"
            required
          />

          <v-text-field
            v-model="insumo.descricao"
            label="Descrição"
            :rules="[v => !!v || 'Descrição é obrigatória']"
          />

          <v-text-field
            v-model.number="insumo.quantidade"
            label="Quantidade mínima de estoque"
            type="number"
            :rules="[v => v >= 0 || 'Quantidade deve ser positiva']"
          />

          <v-text-field
            v-model.number="insumo.preco"
            label="Preço"
            type="number"
            prefix="R$"
            :rules="[v => v >= 0 || 'Preço deve ser positivo']"
          />

          <v-btn color="primary" type="submit" class="mt-4">
            Salvar Alterações
          </v-btn>
        </v-form>
     
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const form = ref(null);
const valid = ref(false);
const erro = ref('');
const insumo = reactive({
  nome: '',
  codigo: '',
  descricao: '',
  quantidade: null,
  preco: null,
});

const id = route.params.id;

onMounted(async () => {
  if (!id) {
    erro.value = 'ID do insumo não informado.';
    return;
  }

  try {
    const dados = await $fetch(`/api/insumos/${id}`);
    if (!dados) {
      erro.value = 'Insumo não encontrado.';
      return;
    }
    Object.assign(insumo, dados);
  } catch (err) {
    erro.value = 'Erro ao carregar insumo.';
    console.error(err);
  }
});

const onSubmit = async () => {
  const { valid: isValid } = await form.value.validate();
  if (!isValid) {
    erro.value = 'Corrija os erros do formulário.';
    return;
  }

  try {
    await $fetch(`/api/insumos/${insumo.id}`, {
      method: 'PUT',
      body: { ...insumo },
    });
    router.push('/insumos/insumos'); 
  } catch (err) {
    erro.value = 'Erro ao salvar alterações.';
    console.error(err);
  }
};



</script>
