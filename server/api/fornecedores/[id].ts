import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  // Obtém o ID do fornecedor a partir dos parâmetros da URL
  const { id } = event.context.params!

  try {
    // Busca o fornecedor no banco de dados usando o Prisma
    const fornecedor = await prisma.fornecedor.findUnique({
      where: {
        id: Number(id), // Converte o ID para número caso seja uma string
      }
    })

    // Se não encontrar o fornecedor, retorna erro 404
    if (!fornecedor) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    // Retorna o fornecedor encontrado
    return fornecedor
  } catch (err) {
    console.error('Erro ao buscar fornecedor:', err)

    // Caso ocorra algum erro, retorna erro 500
    throw createError({ statusCode: 500, statusMessage: 'Erro ao buscar fornecedor' })
  }
})
