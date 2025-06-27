import prisma from '../prisma'

export default defineEventHandler(async () => {
  try {
    const insumos = await prisma.insumo.findMany() 
    if (insumos.length === 0) {
      console.warn('Nenhum insumos encontrado no banco de dados.')
    }
    return insumos
  } catch (err) {
    if (err instanceof Error) {
      console.error('Detalhes do erro:', err.message, err.stack)
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao carregar insumos do banco de dados',
    })
  }
})
