import prisma from '../prisma'

export default defineEventHandler(async () => {
  try {
    // Simples consulta para garantir que o Prisma está funcionando
    const fornecedores = await prisma.fornecedor.findMany()
    
    // Se não encontrar nenhum fornecedor, talvez o erro seja outra coisa
    if (fornecedores.length === 0) {
      console.warn('Nenhum fornecedor encontrado no banco de dados.')
    }

    return fornecedores
  } catch (err) {
    console.error('Erro ao carregar fornecedores:', err)

    // Detalhando mais o erro
    if (err instanceof Error) {
      console.error('Detalhes do erro:', err.message, err.stack)
    }

    // Se houver erro, cria uma resposta de erro com o detalhe
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao carregar fornecedores do banco de dados',
    })
  }
})
