import prisma from '../prisma'

export default defineEventHandler(async () => {
  try {
    const fornecedores = await prisma.fornecedor.findMany()
    
    if (fornecedores.length === 0) {
      console.warn('Nenhum fornecedor encontrado no banco de dados.')
    }

    return fornecedores
  } catch (err) {
    console.error('Erro ao carregar fornecedores:', err)

    if (err instanceof Error) {
      console.error('Detalhes do erro:', err.message, err.stack)
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao carregar fornecedores do banco de dados',
    })
  }
})
