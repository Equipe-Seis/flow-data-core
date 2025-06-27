import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  try {
    const body = await readBody(event)
    const { nome, descricao, codigo, quantidade, preco } = body

    if (!nome || !codigo || isNaN(Number(quantidade)) || isNaN(Number(preco))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Campos inválidos ou ausentes.',
      })
    }

    const insumoAtualizado = await prisma.insumo.update({
      where: {
        id: Number(id), 
      },
      data: {
        nome,
        codigo,
        descricao,
        quantidade: Number(quantidade),
        preco: parseFloat(preco),
      }
    })

    return insumoAtualizado
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar insumo',
    })
  }
  

})

