import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!

  try {
    const insumo = await prisma.insumo.findUnique({
      where: {
        id: Number(id), 
      }
    })
    if (!insumo) {
      throw createError({ statusCode: 404, statusMessage: 'Insumo não encontrado' })
    }
    return insumo
  } catch (err) {

    throw createError({ statusCode: 500, statusMessage: 'Erro ao buscar insumo' })
  }
})
