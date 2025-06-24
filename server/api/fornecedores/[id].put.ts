import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  // Obtém o ID do fornecedor a partir dos parâmetros da URL
  const { id } = event.context.params!
  
  // Obtém os dados enviados no corpo da requisição
  const body = await readBody(event)

  try {
    // Verifica se o fornecedor existe
    const fornecedorExistente = await prisma.fornecedor.findUnique({
      where: {
        id: Number(id), // Converte o ID para número caso seja uma string
      }
    })

    if (!fornecedorExistente) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    // Atualiza o fornecedor no banco de dados com os dados enviados
    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: {
        id: Number(id), // Converte o ID para número
      },
      data: {
        ...body, // Atualiza os campos com os dados recebidos
      }
    })

    // Retorna o fornecedor atualizado
    return fornecedorAtualizado
  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err)

    // Caso ocorra algum erro, retorna erro 500
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar fornecedor' })
  }
})
