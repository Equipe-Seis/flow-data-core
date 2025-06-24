-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" SERIAL NOT NULL,
    "tipoPessoa" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "cnpj" TEXT,
    "fantasia" TEXT,
    "abertura" TIMESTAMP(3),
    "situacao" TEXT,
    "tipo" TEXT,
    "porte" TEXT,
    "natureza_juridica" TEXT,
    "cep" TEXT,
    "logradouro" TEXT,
    "bairro" TEXT,
    "localidade" TEXT,
    "uf" TEXT,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);
