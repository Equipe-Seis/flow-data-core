// server/api/insumos.ts
import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const { nome,codigo ,descricao, quantidade, preco } = body

    if (typeof nome !== 'string' || typeof codigo !== 'string' || isNaN(Number(quantidade)) || isNaN(Number(preco))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campos obrigatórios faltando: nome, codigo, quantidade ou preço.',
      })
    }

    const novoInsumo = await prisma.insumo.create({
      data: {
        nome,
        descricao,
        codigo,
        quantidade: Number(quantidade),
        preco: parseFloat(preco),
      }
    })

    return novoInsumo
  } catch (err) {
    console.error('Erro ao salvar insumo:', err) 
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao salvar insumo no banco de dados',
    })
  }
})
