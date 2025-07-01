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

Rode o projeto em modo desenvolvimento
npm run dev

http://localhost:3000

usuario:admin@teste.com
senha:123456
```