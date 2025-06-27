import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  try {
    const fornecedor = await prisma.fornecedor.findUnique({
      where: {
        id: Number(id), 
      }
    })

    if (!fornecedor) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    return fornecedor
  } catch (err) {
    console.error('Erro ao buscar fornecedor:', err)

    throw createError({ statusCode: 500, statusMessage: 'Erro ao buscar fornecedor' })
  }
})
