<template>
  <v-container>
    <h1>Editar Fornecedor</h1>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <!-- Tipo de Pessoa -->
      <v-select
        v-model="fornecedor.tipoPessoa"
        :items="tiposPessoa"
        label="Tipo de Pessoa"
        required
        class="mb-4"
        @update:modelValue="resetPessoa"
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
        <v-text-field v-model="fornecedor.abertura" label="Data de Abertura" readonly />
        <v-text-field v-model="fornecedor.situacao" label="Situação" readonly />
        <v-text-field v-model="fornecedor.tipo" label="Tipo" readonly />
        <v-text-field v-model="fornecedor.porte" label="Porte" readonly />
        <v-text-field v-model="fornecedor.natureza_juridica" label="Natureza Jurídica" readonly />
      </template>

      <hr class="my-4" />

      <!-- Endereço -->
      <v-text-field
        v-model="fornecedor.cep"
        label="CEP"
        v-mask="'#####-###'"
        @blur="consultarCep"
        :rules="[v => !!v || 'CEP obrigatório']"
      />
      <v-text-field v-model="fornecedor.logradouro" label="Logradouro" />
      <v-text-field v-model="fornecedor.bairro" label="Bairro" />

      <v-select
        v-model="fornecedor.uf"
        :items="estados.map(e => e.sigla)"
        label="UF"
        @update:modelValue="onEstadoChange"
        :rules="[v => !!v || 'UF obrigatório']"
      />

      <v-select
        v-model="fornecedor.localidade"
        :items="cidades.map(c => c.nome)"
        label="Cidade"
        :disabled="cidadeDisabled"
        :rules="[v => !!v || 'Cidade obrigatória']"
      />

      <v-btn type="submit" color="primary" class="mt-4" :disabled="!valid">
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

const tiposPessoa = ['Física', 'Jurídica'];
const estados = ref([]);
const cidades = ref([]);
const cidadeDisabled = ref(true);

const valid = ref(false);
const form = ref(null);
const erro = ref('');
const carregando = ref(false);

const fornecedor = reactive({
  id: null,
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
  uf: ''
});

const validateCNPJ = (v) => {
  const cnpjLimpo = v?.replace(/\D/g, '');
  return /^\d{14}$/.test(cnpjLimpo) || 'CNPJ deve conter 14 números';
};

// Função para formatar data no formato BR
const formatDateBR = (date) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

// Função para converter data para o formato ISO
const convertToISO = (date) => {
  if (!date) return '';
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
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
    erro.value = 'CEP inválido.';
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
    await onEstadoChange(fornecedor.uf);
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

const onEstadoChange = async (uf) => {
  fornecedor.localidade = '';
  cidades.value = [];
  cidadeDisabled.value = true;

  if (!uf) return;

  try {
    const data = await $fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
    cidadeDisabled.value = false;
  } catch (err) {
    erro.value = 'Erro ao carregar cidades.';
    console.error(err);
  }
};

// Ao carregar o fornecedor
onMounted(async () => {
  const id = route.params.id;
  await carregarEstados();

  try {
    const data = await $fetch(`/api/fornecedores/${id}`);
    Object.assign(fornecedor, data);

    // Convertendo datas para o formato BR
    if (fornecedor.dataNascimento) {
      fornecedor.dataNascimento = formatDateBR(fornecedor.dataNascimento);
    }
    if (fornecedor.abertura) {
      fornecedor.abertura = formatDateBR(fornecedor.abertura);
    }

    if (fornecedor.uf) await onEstadoChange(fornecedor.uf);
  } catch (err) {
    erro.value = 'Erro ao carregar fornecedor.';
    console.error(err);
  }
});

const onSubmit = async () => {
  if (!form.value.validate()) return;

  try {
    // Converter as datas para o formato ISO antes de salvar
    fornecedor.dataNascimento = convertToISO(fornecedor.dataNascimento);
    fornecedor.abertura = convertToISO(fornecedor.abertura);

    await $fetch(`/api/fornecedores/${fornecedor.id}`, {
      method: 'PUT',
      body: { ...fornecedor },
    });

    alert('Fornecedor atualizado com sucesso!');
    router.push('/fornecedores/fornecedores');
  } catch (err) {
    erro.value = 'Erro ao salvar alterações.';
    console.error(err);
  }
};
</script>
