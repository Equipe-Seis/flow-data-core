<template>
  <v-container>
        <h1>Cadastro de Insumos</h1>

        <v-alert v-if="erro" type="error" class="mt-2">{{ erro }}</v-alert>
        <br> 
        <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>

          <v-text-field
            v-model="insumo.nome"
            label="Nome"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          />
          <v-text-field
            v-model="insumo.codigo"
            label="Código"
            :rules="[v => !!v || 'Nome é código']"
            required
          />
          <v-text-field
            label="Descrição"
            v-model="insumo.descricao"
            :rules="[v => !!v || 'Nome é descrição']"
          ></v-text-field>

          <v-text-field
            label="Quantidade mínima de estoque"
            v-model.number="insumo.quantidade"
            type="number"
            :rules="[v => !!v || 'Nome é descrição']"
          ></v-text-field>

          <v-text-field
            label="Preço"
            v-model.number="insumo.preco"
            type="number"
            prefix="R$"
            :rules="[v => !!v || 'Nome é preço']"
          ></v-text-field>

          <v-btn color="primary" type="submit" class="mt-4">Cadastrar</v-btn>
        </v-form>
      
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const insumos = ref([]);
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
  const { valid: isValid } = await form.value.validate();

  if (!isValid) {
    erro.value = 'Erro no preenchimento do formulário.';
    return;
  }

  try {
    await $fetch('/api/insumos', {
      method: 'POST',
      body: { ...insumo },
    });
    router.push('/insumos/insumos');
  } catch (err) {
    erro.value = 'Erro ao salvar insumo.';
    console.error('Erro no envio:', err);
  }
};
</script>

