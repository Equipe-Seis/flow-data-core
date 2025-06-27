<template>
  <v-container>
    <h1>Editar Fornecedor</h1>

    <v-alert v-if="erro" type="error" class="mt-2">{{ erro }}</v-alert>

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
        <v-text-field v-model="fornecedor.nome" label="Nome" :rules="[v => !!v || 'Nome é obrigatório']" required />
        <v-text-field
          v-model="fornecedor.cpf"
          label="CPF"
          v-mask="'###.###.###-##'"
          :rules="[v => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) || 'CPF inválido']"
          required
        />
        <v-text-field v-model="fornecedor.dataNascimento" label="Data de Nascimento" v-mask="'##/##/####'" required />
        <v-text-field v-model="fornecedor.telefone" label="Telefone" v-mask="'(##) #####-####'" />
      </template>

      <!-- Pessoa Jurídica -->
      <template v-else>
        <v-text-field
          v-model="fornecedor.cnpj"
          label="CNPJ"
          v-mask="'##.###.###/####-##'"
          :rules="[validateCNPJ]"
          required
        >
          <template #append-inner>
            <v-btn @click="consultarCnpj" :loading="carregando" color="primary" aria-label="Consultar CNPJ">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-text-field>
        <v-text-field v-model="fornecedor.nome" label="Razão Social" readonly />
        <v-text-field v-model="fornecedor.fantasia" label="Nome Fantasia" readonly />
        <v-text-field v-model="fornecedor.telefone" label="Telefone" v-mask="'(##) #####-####'" />
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
        :rules="[validarEmail]"
        required
        clearable
      />

      <hr class="my-4" />

      <!-- Endereço -->
      <v-text-field v-model="fornecedor.cep" label="CEP" v-mask="'#####-###'" :rules="[v => !!v || 'CEP obrigatório']">
        <template #append-inner>
          <v-btn @click="consultarCep" :loading="carregando" color="primary" aria-label="Consultar CEP">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
      </v-text-field>
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
const carregando = ref(false)

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
const validateCNPJ = v => (/^\d{14}$/.test(v?.replace(/\D/g, ''))) || 'CNPJ deve conter 14 números'

const formatDateBR = iso => {
  if (!iso) return ''
  const d = new Date(iso)
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()].map(n => String(n).padStart(2, '0')).join('/')
}

const carregarEstados = async () => {
  try {
    const data = await $fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome))
  } catch {
    erro.value = 'Erro ao carregar estados.'
  }
}

const onEstadoChange = async uf => {
  fornecedor.localidade = ''
  cidades.value = []
  cidadeDisabled.value = true
  if (!uf) return
  try {
    const data = await $fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    )
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome))
    cidadeDisabled.value = false
  } catch {
    erro.value = 'Erro ao carregar cidades.'
  }
}

onMounted(async () => {
  await carregarEstados()
  try {
    const data = await $fetch(`/api/fornecedores/${route.params.id}`)
   
    Object.assign(fornecedor, data)
    fornecedor.dataNascimento = formatDateBR(data.dataNascimento)
    fornecedor.abertura = formatDateBR(data.abertura)

    if (data.uf) {
      await onEstadoChange(data.uf)

      const cidadeApi = data.localidade
      const encontrada = cidades.value.find(c => c.nome === cidadeApi)
      if (encontrada) {
        fornecedor.localidade = cidadeApi
      } else {
        console.warn(`Cidade não encontrada na lista: "${cidadeApi}" para UF "${data.uf}"`)
      }
    }
  } catch (err) {
    erro.value = 'Erro ao carregar fornecedor.'
    console.error(err)
  }
})


const onSubmit = async () => {
  if (!form.value.validate()) return
  try {
    await $fetch(`/api/fornecedores/${fornecedor.id}`, {
      method: 'PUT',
      body: { ...fornecedor },
    })
    router.push('/fornecedores/fornecedores')
  } catch {
    erro.value = 'Erro ao salvar alterações.'
  }
}
</script>
