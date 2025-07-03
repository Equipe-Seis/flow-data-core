# 🌐 Projeto Fullstack com Nuxt 3, API interna, Vuetify e Prisma

Projeto fullstack utilizando **Nuxt 3**, com:

- ⚙️ Frontend em Vue 3 (Composition API)
- 📡 Backend (API interna via `/server/api`)
- 🎨 UI com Vuetify 3
- 🗄️ ORM com Prisma e banco PostgreSQL (via Supabase)
- 📦 Gerenciador de pacotes: `npm`

---

## 🚀 Tecnologias utilizadas

- [Nuxt 3](https://nuxt.com)
- [Vuetify 3](https://next.vuetifyjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL (via Supabase)](https://supabase.com/)
- [Vercel (Deploy)](https://vercel.com)

---

## 📁 Estrutura do projeto

```bash
.
├── app.vue               # Componente raiz
├── pages/                # Rotas da aplicação (SSR/SPA)
├── server/
│   └── api/              # Rotas da API interna (ex: /api/hello)
├── prisma/
│   ├── schema.prisma     # Modelo do banco
│   ├── seeds             # seeder de banco de dados
│   └── migrations/       # Migrações
├── composables/          # Funções reutilizáveis (useXYZ)
├── plugins/              # Plugins Nuxt (ex: Vuetify)
├── nuxt.config.ts        # Configuração principal do Nuxt
├── .env.example          # Exemplo de variáveis de ambiente
├── README.md             # Documentação do projeto

```

## 📁 Como rodar o projeto localmente

```bash
1. Clone o repositório
git clone https://github.com/sua-organizacao/nome-do-repositorio.git
cd nome-do-repositorio

2. Instale as dependências
npm install

3. Configure o ambiente
cp .env.example .env

DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco

4. Configure o Prisma

npx prisma generate
npx prisma db push

ou npx prisma migrate dev se estiver usando migrações

npm run seed - para rodar as seeds 

Rode o projeto em modo desenvolvimento
npm run dev

http://localhost:3000

usuario:admin@teste.com
senha:123456
```

## 📦 Projeto: API Local para Cadastro de Fornecedores e Insumos

```bash

Esta API local foi desenvolvida para automatizar e padronizar o cadastro de fornecedores (pessoas físicas ou jurídicas) e insumos, utilizando dados oficiais de serviços públicos brasileiros. A aplicação centraliza e valida as informações recebidas por meio de três integrações externas.

🔗 Integrações Utilizadas
📮 ViaCEP
Consulta de endereço automático a partir do CEP, preenchendo campos como logradouro, bairro, cidade e UF.

🏛️ ReceitaWS
Utilizado para buscar e validar informações de empresas com base no CNPJ

📊 IBGE
Obtenção padronizada de dados de municípios, estados  oficiais IBGE.