/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Fornecedor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Insumo` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `tipoPessoa` on the `Fornecedor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('Física', 'Jurídica');

-- AlterTable
ALTER TABLE "Fornecedor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "tipoPessoa",
ADD COLUMN     "tipoPessoa" "TipoPessoa" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cpf_key" ON "Fornecedor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_cnpj_key" ON "Fornecedor"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Fornecedor_email_key" ON "Fornecedor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_codigo_key" ON "Insumo"("codigo");
