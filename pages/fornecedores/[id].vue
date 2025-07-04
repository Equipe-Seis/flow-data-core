<template>
  <v-container>
    <h1>Editar Fornecedor</h1>

    <v-alert v-if="erro" type="error" class="mt-2 mb-4">{{ erro }}</v-alert>

    <v-form ref="form" @submit.prevent="onSubmit" v-model="valid" lazy-validation>
      <v-select
        v-model="fornecedor.tipoPessoa"
        :items="tiposPessoa"
        label="Tipo de Pessoa"
        :rules="[v => !!v || 'Tipo de pessoa é obrigatório']"
        required
        class="mb-4"
        @update:modelValue="resetPessoaFields"
      />

      <template v-if="fornecedor.tipoPessoa === 'Física'">
        <v-text-field
          v-model="fornecedor.nome"
          label="Nome Completo"
          :rules="[v => !!v || 'Nome é obrigatório']"
          required
        />
        <v-text-field
          v-model="fornecedor.cpf"
          label="CPF"
          v-maska
          data-maska="###.###.###-##"
          :rules="[v => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'CPF inválido']"
          required
        />
        <v-text-field
          v-model="fornecedor.dataNascimento"
          label="Data de Nascimento"
          v-maska
          data-maska="##/##/####"
          :rules="[
            v => !!v || 'Data de Nascimento é obrigatória',
            v => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'Formato de data inválido (DD/MM/AAAA)'
          ]"
          required
        />
        <v-text-field
          v-model="fornecedor.telefone"
          label="Telefone"
          v-maska
          data-maska="(##) #####-####"
          :rules="[v => !!v || 'Telefone é obrigatório']"
          required
        />
      </template>

      <template v-else>
        <v-text-field
          v-model="fornecedor.cnpj"
          label="CNPJ"
          v-maska
          data-maska="##.###.###/####-##"
          :rules="[validateCNPJ]"
          required
        >
          <template #append-inner>
            <v-btn icon @click="consultarCnpj" :loading="carregandoCnpj" color="primary" aria-label="Consultar CNPJ">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-text-field v-model="fornecedor.nome" label="Razão Social" :rules="[v => !!v || 'Razão Social é obrigatória']" readonly />
        <v-text-field v-model="fornecedor.fantasia" label="Nome Fantasia" readonly />
        <v-text-field
          v-model="fornecedor.telefone"
          label="Telefone"
          v-maska
          data-maska="(##) #####-####"
          :rules="[v => !!v || 'Telefone é obrigatório']"
          required
        />
        <v-text-field v-model="fornecedor.abertura" label="Data de Abertura" readonly />
        <v-text-field v-model="fornecedor.situacao" label="Situação" readonly />
        <v-text-field v-model="fornecedor.tipo" label="Tipo" readonly />
        <v-text-field v-model="fornecedor.porte" label="Porte" readonly />
        <v-text-field v-model="fornecedor.natureza_juridica" label="Natureza Jurídica" readonly />
      </template>

      <v-text-field
        v-model="fornecedor.email"
        label="E-mail"
        type="email"
        :rules="[v => !!v || 'E-mail é obrigatório', validarEmail]"
        required
        clearable
      />

      <v-divider class="my-4" />

      <h2 class="text-h6 mb-4">Endereço</h2>
      <v-text-field
        v-model="fornecedor.cep"
        label="CEP"
        v-maska
        data-maska="#####-###"
        :rules="[v => !!v || 'CEP é obrigatório', v => /^\d{5}-\d{3}$/.test(v) || 'CEP inválido']"
        required
      >
        <template #append-inner>
          <v-btn icon @click="consultarCep" :loading="carregandoCep" color="primary" aria-label="Consultar CEP">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field
        v-model="fornecedor.logradouro"
        label="Logradouro"
        :rules="[v => !!v || 'Logradouro é obrigatório']"
        required
      />
      <v-text-field
        v-model="fornecedor.bairro"
        label="Bairro"
        :rules="[v => !!v || 'Bairro é obrigatório']"
        required
      />

      <v-select
        v-model="fornecedor.uf"
        :items="estados.map(e => e.sigla)"
        label="UF"
        @update:modelValue="onEstadoChange"
        :rules="[v => !!v || 'UF é obrigatório']"
        required
      />

      <v-select
        v-model="fornecedor.localidade"
        :items="cidades.map(c => c.nome)"
        label="Cidade"
        :disabled="cidadeDisabled || cidades.length === 0"
        :rules="[v => !!v || 'Cidade é obrigatória']"
        required
      />

      <div class="d-flex justify-end mt-6">
        <v-btn color="secondary" class="me-2" @click="router.back()">
          Voltar
        </v-btn>
        <v-btn type="submit" color="primary" :disabled="!valid" :loading="carregandoSubmit">
          Salvar Alterações
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tiposPessoa = ['Física', 'Jurídica']
const estados = ref([])
const cidades = ref([])
const cidadeDisabled = ref(true)

const valid = ref(false)
const form = ref(null)
const erro = ref('')
const carregandoCnpj = ref(false)
const carregandoCep = ref(false)
const carregandoSubmit = ref(false)

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
  uf: '',
  email: '',
})

const validarEmail = v => (!!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || 'E-mail inválido'

const validateCNPJ = v => {
  if (!v) return 'CNPJ é obrigatório';
  const cnpjLimpo = v?.replace(/\D/g, '');
  if (!/^\d{14}$/.test(cnpjLimpo)) return 'CNPJ deve conter 14 números';
  return true;
};

const formatDateBR = iso => {
  if (!iso) return ''
  const d = new Date(iso)
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(n => String(n).padStart(2, '0')).join('/')
}

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
  form.value?.resetValidation();
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
      fornecedor.telefone = '';
      fornecedor.abertura = '';
      fornecedor.situacao = '';
      fornecedor.tipo = '';
      fornecedor.porte = '';
      fornecedor.natureza_juridica = '';
      return;
    }

    fornecedor.nome = data.nome || '';
    fornecedor.fantasia = data.fantasia || '';
    fornecedor.telefone = data.telefone || '';
    fornecedor.abertura = formatDateBR(data.abertura) || '';
    fornecedor.situacao = data.situacao || '';
    fornecedor.tipo = data.tipo || '';
    fornecedor.porte = data.porte || '';
    fornecedor.natureza_juridica =  data.natureza_juridica || ''; 
    fornecedor.email = data.email || '';

    if (data.cep) {
        fornecedor.cep = data.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
        await consultarCep(true);
    }

  } catch (e) {
    erro.value = 'Erro ao consultar o CNPJ. Verifique a conexão ou o CNPJ.';
    console.error(e);
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
    console.error(e);
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
    console.error(err);
  }
};

const onEstadoChange = async uf => {
  fornecedor.localidade = '';
  cidades.value = [];
  cidadeDisabled.value = true;

  if (!uf) return

  try {
    const data = await $fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    )
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome))
    cidadeDisabled.value = false
  } catch (err) {
    erro.value = 'Erro ao carregar cidades para este estado.';
    console.error(err);
  }
}

onMounted(async () => {
  await carregarEstados();

  try {
    const fornecedorId = route.params.id;
    if (!fornecedorId) {
      erro.value = 'ID do fornecedor não encontrado na rota.';
      return;
    }

    const data = await $fetch(`/api/fornecedores/${fornecedorId}`);
    
    Object.assign(fornecedor, data);

    if (fornecedor.dataNascimento) {
      fornecedor.dataNascimento = formatDateBR(fornecedor.dataNascimento);
    }
    if (fornecedor.abertura) {
      fornecedor.abertura = formatDateBR(fornecedor.abertura);
    }

    if (fornecedor.cep) {
        fornecedor.cep = fornecedor.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
    }
    if (fornecedor.cnpj) {
        fornecedor.cnpj = fornecedor.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    if (fornecedor.cpf) {
        fornecedor.cpf = fornecedor.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    }
    if (fornecedor.telefone) {
        const telLimpo = fornecedor.telefone.replace(/\D/g, '');
        if (telLimpo.length === 11) {
            fornecedor.telefone = `(${telLimpo.substring(0,2)}) ${telLimpo.substring(2,7)}-${telLimpo.substring(7,11)}`;
        } else if (telLimpo.length === 10) {
            fornecedor.telefone = `(${telLimpo.substring(0,2)}) ${telLimpo.substring(2,6)}-${telLimpo.substring(6,10)}`;
        }
    }

    if (fornecedor.uf) {
      await onEstadoChange(fornecedor.uf);
      if (fornecedor.localidade && cidades.value.length > 0) {
        const cidadeEncontrada = cidades.value.find(c => c.nome === fornecedor.localidade);
        if (!cidadeEncontrada) {
          console.warn(`Cidade "${fornecedor.localidade}" não encontrada para UF "${fornecedor.uf}".`);
        }
      }
    }

  } catch (err) {
    erro.value = 'Erro ao carregar fornecedor. Verifique se o ID está correto.';
    console.error(err);
    router.push('/fornecedores/fornecedores');
  }
});

const onSubmit = async () => {
  erro.value = '';
  carregandoSubmit.value = true;

  const { valid: isValid } = await form.value.validate();

  if (!isValid) {
    erro.value = 'Por favor, corrija os erros no formulário antes de salvar.';
    carregandoSubmit.value = false;
    return;
  }

  try {
    const fornecedorParaEnviar = { ...fornecedor };
    fornecedorParaEnviar.cpf = fornecedorParaEnviar.cpf?.replace(/\D/g, '');
    fornecedorParaEnviar.cnpj = fornecedorParaEnviar.cnpj?.replace(/\D/g, '');
    fornecedorParaEnviar.cep = fornecedorParaEnviar.cep?.replace(/\D/g, '');
    fornecedorParaEnviar.telefone = fornecedorParaEnviar.telefone?.replace(/\D/g, '');
    
    if (fornecedorParaEnviar.dataNascimento) {
      const parts = fornecedorParaEnviar.dataNascimento.split('/');
      if (parts.length === 3) {
        fornecedorParaEnviar.dataNascimento = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    await $fetch(`/api/fornecedores/${fornecedor.id}`, {
      method: 'PUT',
      body: fornecedorParaEnviar,
    });
    router.push('/fornecedores/fornecedores');
  } catch (err) {
    erro.value = 'Erro ao salvar alterações. Por favor, tente novamente.';
    console.error(err);
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
</style>