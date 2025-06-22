<template>
  <v-container>
    <h1>Cadastro de Fornecedores</h1>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <!-- Tipo -->
      <v-select
        v-model="fornecedor.tipoPessoa"
        :items="tiposPessoa"
        label="Tipo de Pessoa"
        required
        class="mb-4"
      />

      <!-- Pessoa Física -->
      <template v-if="fornecedor.tipoPessoa === 'Física'">
        <v-text-field
          v-model="fornecedor.nome"
          label="Nome"
          :rules="[v => !!v || 'Nome é obrigatório']"
          required
        />
        <v-text-field
          v-model="fornecedor.cpf"
          label="CPF"
          v-mask="'###.###.###-##'"
          :rules="[v => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'CPF inválido']"
          required
        />
        <v-text-field
          v-model="fornecedor.dataNascimento"
          label="Data de Nascimento"
          v-mask="'##/##/####'"
          required
        />
        <v-text-field
          v-model="fornecedor.telefone"
          label="Telefone"
          v-mask="'(##) #####-####'"
        />
      </template>

      <!-- Pessoa Jurídica -->
      <template v-else>
        <v-text-field
          v-model="fornecedor.cnpj"
          label="CNPJ"
          v-mask="'##.###.###/####-##'"
          :rules="[validateCNPJ]"
          required
        />
        <v-btn @click="consultarCnpj" :loading="carregando" color="primary">
          Consultar CNPJ
        </v-btn>
        <v-alert v-if="erro" type="error" class="mt-2">{{ erro }}</v-alert>

        <v-text-field
          v-model="fornecedor.nome"
          label="Razão Social"
          readonly
        />
        <v-text-field
          v-model="fornecedor.fantasia"
          label="Nome Fantasia"
          readonly
        />
        <v-text-field
          v-model="fornecedor.telefone"
          label="Telefone"
          v-mask="'(##) #####-####'"
        />
        <v-text-field
          v-model="fornecedor.abertura"
          label="Data de Abertura"
          :readonly="true"
        />
        <v-text-field
          v-model="fornecedor.situacao"
          label="Situação"
          :readonly="true"
        />
        <v-text-field
          v-model="fornecedor.tipo"
          label="Tipo"
          :readonly="true"
        />
        <v-text-field
          v-model="fornecedor.porte"
          label="Porte"
          :readonly="true"
        />
        <v-text-field
          v-model="fornecedor.natureza_juridica"
          label="Natureza Jurídica"
          :readonly="true"
        />
      </template>

      <hr />

      <v-text-field
        v-model="fornecedor.cep"
        label="CEP"
        v-mask="'#####-###'"
        @blur="consultarCep"
        :rules="[v => !!v || 'CEP obrigatório']"
      />

<v-select
  v-model="fornecedor.uf"
  :items="estados.map(e => e.sigla)"
  label="UF"
  :rules="[v => !!v || 'UF obrigatório']"
  @update:modelValue="onEstadoChange"
/>

    <v-select
    v-model="fornecedor.localidade"
    :items="cidades.map(c => c.nome)"
    label="Cidade"
    :disabled="cidadeDisabled"
    :rules="[v => !!v || 'Cidade obrigatória']"
    />

      <v-text-field
        v-model="fornecedor.logradouro"
        label="Logradouro"
        :rules="[v => !!v || 'Logradouro obrigatório']"
        required
      />

      <v-text-field
        v-model="fornecedor.bairro"
        label="Bairro"
        :rules="[v => !!v || 'Bairro obrigatório']"
        required
      />

      <v-btn type="submit" color="success" class="mt-4" :disabled="!valid">
        Cadastrar
      </v-btn>
    </v-form>

    <!-- Lista -->
    <v-list subheader class="mt-5">
      <v-subheader>Fornecedores Cadastrados</v-subheader>
      <v-list-item v-for="(f, i) in fornecedores" :key="i">
        <v-list-item-content>
          <v-list-item-title>{{ f.nome }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ f.tipoPessoa }} - {{ f.cnpj || f.cpf || '-' }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const tiposPessoa = ['Física', 'Jurídica'];
const fornecedores = ref([]);
const form = ref(null);
const valid = ref(false);
const carregando = ref(false);
const erro = ref('');

const fornecedor = reactive({
  tipoPessoa: 'Física',
  nome: '',
  cpf: '',
  dataNascimento: '',
  telefone: '',
  cnpj: '',
  fantasia: '',
  abertura: '',
  situacao: '',
  tipo: '',
  porte: '',
  natureza_juridica: '',
  cep: '',
  logradouro: '',
  bairro: '',
  localidade: '',
  uf: '',
});

const estados = ref([]);
const cidades = ref([]);
const cidadeDisabled = ref(true);

const validateCNPJ = (v) => {
  const cnpjLimpo = v?.replace(/\D/g, '');
  return /^\d{14}$/.test(cnpjLimpo) || 'CNPJ deve conter 14 números';
};

const consultarCnpj = async () => {
  erro.value = '';
  carregando.value = true;

  const cnpjLimpo = fornecedor.cnpj.replace(/\D/g, '');

  if (!/^\d{14}$/.test(cnpjLimpo)) {
    erro.value = 'CNPJ inválido.';
    carregando.value = false;
    return;
  }

  try {
    const data = await $fetch(`/api/cnpj/${cnpjLimpo}`);

    fornecedor.nome = data.nome || '';
    fornecedor.fantasia = data.fantasia || '';
    fornecedor.telefone = data.telefone || '';
    fornecedor.abertura = data.abertura || '';
    fornecedor.situacao = data.situacao || '';
    fornecedor.tipo = data.tipo || '';
    fornecedor.porte = data.porte || '';
    fornecedor.natureza_juridica = data.natureza_juridica || '';
  } catch (e) {
    erro.value = 'Erro ao consultar a ReceitaWS.';
    console.error(e);
  } finally {
    carregando.value = false;
  }
};

const consultarCep = async () => {
  const cepLimpo = fornecedor.cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cepLimpo)) {
    erro.value = 'CEP inválido. Deve conter 8 números.';
    return;
  }

  try {
    const data = await $fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (data.erro) {
      erro.value = 'CEP não encontrado.';
      return;
    }

    fornecedor.logradouro = data.logradouro || '';
    fornecedor.bairro = data.bairro || '';
    fornecedor.uf = data.uf || '';

    // Carregar cidades para o estado retornado pelo CEP
    if (fornecedor.uf) {
      await onEstadoChange(fornecedor.uf);
    }

    fornecedor.localidade = data.localidade || '';
  } catch (e) {
    erro.value = 'Erro ao consultar o CEP.';
    console.error(e);
  }
};

const carregarEstados = async () => {
  try {
    const data = await $fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (err) {
    erro.value = 'Erro ao carregar estados.';
    console.error(err);
  }
};

onMounted(() => {
  carregarEstados();
});

const onEstadoChange = async (uf) => {
  fornecedor.localidade = '';
  cidades.value = [];
  cidadeDisabled.value = true;

  try {
    const data = await $fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
    cidadeDisabled.value = false;
  } catch (err) {
    erro.value = 'Erro ao carregar cidades.';
    console.error(err);
  }
};


const onSubmit = async () => {
  if (!form.value.validate()) return;

  try {
    await $fetch('/api/fornecedores', {
      method: 'POST',
      body: { ...fornecedor },
    });

    alert('Fornecedor salvo com sucesso!');
    //fornecedores.value.push({ ...fornecedor });
    router.push('/fornecedores/fornecedores')
    // Resetar campos
    /*Object.assign(fornecedor, {
      tipoPessoa: 'Física',
      nome: '',
      cpf: '',
      dataNascimento: '',
      telefone: '',
      cnpj: '',
      fantasia: '',
      abertura: '',
      situacao: '',
      tipo: '',
      porte: '',
      natureza_juridica: '',
      cep: '',
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: '',
    });*/
  } catch (err) {
    erro.value = 'Erro ao salvar fornecedor.';
    console.error(err);
  }

  erro.value = '';
};

onMounted(() => {
  carregarEstados();
});
</script>
