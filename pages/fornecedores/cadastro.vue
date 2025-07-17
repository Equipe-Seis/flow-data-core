<template>
  <v-container>
    <h1 class="text-h4 mb-4">Cadastro de Fornecedores</h1>

    <v-alert v-if="erro" type="error" class="mb-5">{{ erro }}</v-alert>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-select v-model="fornecedor.tipoPessoa" :items="tiposPessoa" label="* Tipo de Pessoa"
        :rules="[v => !!v || 'Tipo de pessoa é obrigatório']" required class="mb-4"
        @update:modelValue="resetPessoaFields" />

      <template v-if="fornecedor.tipoPessoa === 'Física'">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="fornecedor.nome" label="* Nome Completo" :rules="[v => !!v || 'Nome é obrigatório']"
              required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.cpf" label="* CPF" v-mask="'###.###.###-##'"
              :rules="[v => !!v || 'CPF é obrigatório', v => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'CPF inválido']"
              required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.dataNascimento" label="* Data de Nascimento" v-mask="'##/##/####'"
              :rules="birth_date_rule" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.telefone" label="* Telefone" v-mask="'(##) #####-####'"
              :rules="[v => !!v || 'Telefone é obrigatório']" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.email" label="* E-mail" type="email"
              :rules="[v => !!v || 'E-mail é obrigatório', validarEmail]" required clearable />
          </v-col>
        </v-row>
      </template>

      <template v-else>
        <v-row>
          <v-col cols="12" sm="8">
            <v-text-field v-model="fornecedor.cnpj" label="* CNPJ" v-mask="'##.###.###/####-##'" :rules="[validateCNPJ]"
              required>
              <template #append-inner>
                <v-btn icon @click="consultarCnpj" :loading="carregandoCnpj" color="primary"
                  aria-label="Consultar CNPJ">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="fornecedor.abertura" label="Data de Abertura" :readonly="true" />
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field v-model="fornecedor.nome" label="* Razão Social"
              :rules="[v => !!v || 'Razão Social é obrigatória']" required />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field v-model="fornecedor.fantasia" label="Nome Fantasia" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.telefone" label="* Telefone" v-mask="'(##) #####-####'"
              :rules="[v => !!v || 'Telefone é obrigatório']" required />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.email" label="* E-mail" type="email"
              :rules="[v => !!v || 'E-mail é obrigatório', validarEmail]" required clearable />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.situacao" label="Situação" :readonly="true" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.tipo" label="Tipo" :readonly="true" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field v-model="fornecedor.porte" label="Porte" :readonly="true" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="fornecedor.natureza_juridica" label="Natureza Jurídica" :readonly="true" />
          </v-col>
        </v-row>
      </template>

      <h2 class="text-h6 mt-6">Endereço</h2>
      <v-divider class="mb-4"></v-divider>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="fornecedor.cep" label="* CEP" v-mask="'#####-###'"
            :rules="[v => !!v || 'CEP é obrigatório', v => /^\d{5}-\d{3}$/.test(v) || 'CEP inválido']" required
            append-inner-icon="mdi-magnify" @click:append-inner="consultarCep">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="fornecedor.logradouro" label="* Logradouro"
            :rules="[v => !!v || 'Logradouro é obrigatório']" required />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="fornecedor.bairro" label="* Bairro" :rules="[v => !!v || 'Bairro é obrigatório']"
            required />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select v-model="fornecedor.uf" :items="estados.map(e => e.sigla)" label="* UF"
            :rules="[v => !!v || 'UF é obrigatório']" @update:modelValue="onEstadoChange" required />
        </v-col>
        <v-col cols="12" sm="6">
          <v-select v-model="fornecedor.localidade" :items="cidades.map(c => c.nome)" label="* Cidade"
            :disabled="cidadeDisabled || cidades.length === 0" :rules="[v => !!v || 'Cidade é obrigatória']" required />
        </v-col>
      </v-row>

      <div class="d-flex justify-end ga-4">
        <v-btn class="me-2" @click="router.back()">
          Cancelar
        </v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="carregandoSubmit">
          Cadastrar
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const tiposPessoa = ref(['Física', 'Jurídica']);
const form = ref(null);
const valid = ref(false);
const carregandoCnpj = ref(false);
const carregandoCep = ref(false);
const carregandoSubmit = ref(false);
const erro = ref('');

const estados = ref([]);
const cidades = ref([]);
const cidadeDisabled = ref(true);

const birth_date_rule = [
	v => !!v || 'Data de Nascimento é obrigatória',
	v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Formato de data inválido (DD/MM/AAAA)'
];

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
  email: '',
});

const validarEmail = (v) => {
  if (!v) return 'E-mail é obrigatório.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(v) || 'E-mail inválido.';
};

const validateCNPJ = (v) => {
  if (!v) return 'CNPJ é obrigatório';
  const cnpjLimpo = v?.replace(/\D/g, '');
  if (!/^\d{14}$/.test(cnpjLimpo)) return 'CNPJ deve conter 14 números';
  return true;
};

const resetPessoaFields = (newType) => {
  if (newType === 'Física') {
    fornecedor.cnpj = '';
    fornecedor.fantasia = '';
    fornecedor.abertura = '';
    fornecedor.situacao = '';
    fornecedor.tipo = '';
    fornecedor.porte = '';
    fornecedor.natureza_juridica = '';
  } else {
    fornecedor.cpf = '';
    fornecedor.dataNascimento = '';
  }
  if (form.value) {
    form.value.resetValidation();
  }
};

const consultarCnpj = async () => {
  erro.value = '';
  carregandoCnpj.value = true;

  const cnpjLimpo = fornecedor.cnpj.replace(/\D/g, '');

  if (!/^\d{14}$/.test(cnpjLimpo)) {
    erro.value = 'CNPJ inválido. Por favor, insira 14 números.';
    carregandoCnpj.value = false;
    return;
  }

  try {
    const data = await $fetch(`/api/cnpj/${cnpjLimpo}`);

    if (data.status === 'ERROR' || !data.nome) { 
      erro.value = data.message || 'CNPJ não encontrado ou erro na consulta.';
      fornecedor.nome = ''; 
      fornecedor.fantasia = '';
      fornecedor.abertura = '';
      fornecedor.situacao = '';
      fornecedor.tipo = '';
      fornecedor.porte = '';
      fornecedor.natureza_juridica = '';
      fornecedor.cep = '';
      fornecedor.logradouro = '';
      fornecedor.bairro = '';
      fornecedor.uf = '';
      fornecedor.localidade = '';
      cidadeDisabled.value = true;
      cidades.value = [];
      return;
    }

    fornecedor.nome = data.nome || '';
    fornecedor.fantasia = data.fantasia || '';
    fornecedor.telefone = data.telefone || ''; 
    //fornecedor.abertura = formatDateBR(data.abertura_data) || '';
    fornecedor.abertura = data.abertura || '';
    fornecedor.situacao = data.situacao || '';
    fornecedor.tipo = data.tipo || '';
    fornecedor.porte = data.porte || '';
    fornecedor.natureza_juridica =  data.natureza_juridica || ''; 
    fornecedor.email = data.email || '';
    
    if (data.cep) {
        fornecedor.cep = data.cep.replace(/\./g, ''); 
        await consultarCep(true); 
    }
  } catch (e) {
    erro.value = 'Erro ao consultar o CNPJ. Verifique a conexão ou o CNPJ.';
    console.error('Erro na consulta CNPJ:', e);
    fornecedor.nome = ''; 
    fornecedor.fantasia = '';
    fornecedor.abertura = '';
    fornecedor.situacao = '';
    fornecedor.tipo = '';
    fornecedor.porte = '';
    fornecedor.natureza_juridica = '';
    fornecedor.cep = '';
    fornecedor.logradouro = '';
    fornecedor.bairro = '';
    fornecedor.uf = '';
    fornecedor.localidade = '';
    cidadeDisabled.value = true;
    cidades.value = [];
  } finally {
    carregandoCnpj.value = false;
  }
};

const consultarCep = async (fromCnpjConsult = false) => {
  erro.value = '';
  carregandoCep.value = true;

  const cepLimpo = fornecedor.cep.replace(/\D/g, '');

  if (!/^\d{8}$/.test(cepLimpo)) {
    if (!fromCnpjConsult) { 
      erro.value = 'CEP inválido. Deve conter 8 números.';
    }
    carregandoCep.value = false;
    return;
  }

  try {
    const data = await $fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    if (data.erro) {
      erro.value = 'CEP não encontrado.';
      fornecedor.logradouro = '';
      fornecedor.bairro = '';
      fornecedor.uf = '';
      fornecedor.localidade = '';
      cidadeDisabled.value = true;
      cidades.value = [];
      return;
    }

    fornecedor.logradouro = data.logradouro || '';
    fornecedor.bairro = data.bairro || '';
    fornecedor.uf = data.uf || '';

    if (fornecedor.uf) {
      await onEstadoChange(fornecedor.uf);
    }

    fornecedor.localidade = data.localidade || '';
  } catch (e) {
    erro.value = 'Erro ao consultar o CEP. Verifique a conexão ou o CEP.';
    console.error('Erro na consulta CEP:', e);
    fornecedor.logradouro = '';
    fornecedor.bairro = '';
    fornecedor.uf = '';
    fornecedor.localidade = '';
    cidadeDisabled.value = true;
    cidades.value = [];
  } finally {
    carregandoCep.value = false;
  }
};

const carregarEstados = async () => {
  try {
    const data = await $fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (err) {
    erro.value = 'Erro ao carregar estados. Tente recarregar a página.';
    console.error('Erro ao carregar estados:', err);
  }
};

onMounted(() => {
  carregarEstados();
});

const onEstadoChange = async (uf) => {
  fornecedor.localidade = '';
  cidades.value = [];
  cidadeDisabled.value = true; 

  if (!uf) {
    return;
  }

  try {
    const data = await $fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
    cidadeDisabled.value = false;
  } catch (err) {
    erro.value = 'Erro ao carregar cidades para este estado.';
    console.error('Erro ao carregar cidades:', err);
  }
};

const onSubmit = async () => {
  erro.value = ''; 
  carregandoSubmit.value = true; 

  const { valid: isValid } = await form.value.validate();

  if (!isValid) {
    erro.value = 'Por favor, corrija os erros no formulário antes de cadastrar.';
    carregandoSubmit.value = false;
    return;
  }

  try {
    const fornecedorParaEnviar = { ...fornecedor };
    fornecedorParaEnviar.cpf = fornecedorParaEnviar.cpf?.replace(/\D/g, '');
    fornecedorParaEnviar.cnpj = fornecedorParaEnviar.cnpj?.replace(/\D/g, '');
    fornecedorParaEnviar.cep = fornecedorParaEnviar.cep?.replace(/\D/g, '');
    fornecedorParaEnviar.telefone = fornecedorParaEnviar.telefone?.replace(/\D/g, '');
    

    await $fetch('/api/fornecedores', {
      method: 'POST',
      body: fornecedorParaEnviar,
    });
    router.push('/fornecedores/fornecedores'); 
  } catch (err) {
    console.error('Erro ao salvar fornecedor:', err);
    if (err.response && err.response._data && err.response._data.message) {
      erro.value = err.response._data.message;
    } else {
      erro.value = 'Erro ao salvar fornecedor. Por favor, tente novamente.';
    }
  } finally {
    carregandoSubmit.value = false; 
  }
};

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});
</script>

<style scoped>
.v-btn.v-btn--icon.v-btn--density-default {
  height: calc(var(--v-btn-height) * 0.8); 
}
</style>