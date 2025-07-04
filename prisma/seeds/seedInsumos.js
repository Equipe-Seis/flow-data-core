import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
})

export async function seedInsumos() {
  await prisma.insumo.createMany({
    data: [
      {
        nome: 'Parafuso Phillips M4x16',
        codigo: 'PARA-M4-16',
        descricao: 'Parafuso com cabeça Phillips, aço inox, 16mm',
        quantidade: 500,
        preco: 0.12,
      },
      {
        nome: 'Porca Sextavada M6',
        codigo: 'PORC-M6',
        descricao: 'Porca padrão ISO para parafuso M6',
        quantidade: 800,
        preco: 0.08,
      },
      {
        nome: 'Chapa de Alumínio 1mm',
        codigo: 'CHAP-AL-1MM',
        descricao: 'Chapa fina para acabamento',
        quantidade: 200,
        preco: 95.00,
      },
      {
        nome: 'Tinta PU Branca 5L',
        codigo: 'TINT-PU-WHT',
        descricao: 'Tinta poliuretano para pintura externa',
        quantidade: 30,
        preco: 75.50,
      },
      {
        nome: 'Fita Isolante 20m',
        codigo: 'FITA-ISO-20',
        descricao: 'Fita isolante elétrica preta',
        quantidade: 100,
        preco: 2.50,
      },
      {
        nome: 'Rolamento 6203ZZ',
        codigo: 'ROL-6203',
        descricao: 'Rolamento blindado para motores',
        quantidade: 60,
        preco: 6.74,
      },
      {
        nome: 'Eletrodo 2,5mm',
        codigo: 'ELE-25MM',
        descricao: 'Eletrodo revestido para solda comum',
        quantidade: 150,
        preco: 1.27,
      },
      {
        nome: 'Óleo Lubrificante 1L',
        codigo: 'OLEO-1L',
        descricao: 'Lubrificante para engrenagens industriais',
        quantidade: 40,
        preco: 18.99,
      },
      {
        nome: 'Arame MIG 0,8mm',
        codigo: 'ARAM-MIG-08',
        descricao: 'Carretel de arame para solda MIG',
        quantidade: 20,
        preco: 110.01,
      },
      {
        nome: 'Luva de Segurança T9',
        codigo: 'LUVA-T9',
        descricao: 'Luva de vaqueta tamanho 9',
        quantidade: 70,
        preco: 14.34,
      },
    ],
  })

  console.log('Insumos inseridos com sucesso.')
}