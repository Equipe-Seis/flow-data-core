-- CreateTable
CREATE TABLE "Insumo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT,
    "quantidade" INTEGER NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);
