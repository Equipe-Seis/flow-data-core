import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  
  const body = await readBody(event)

  let dataNascimento = null
  let abertura = null

  const convertToISO = (dataBr: string) => {
    const [day, month, year] = dataBr.split('/').map(Number)
    return new Date(year, month - 1, day).toISOString() 
  }

  if (body.tipoPessoa === 'Física' && body.dataNascimento) {
    try {
      dataNascimento = convertToISO(body.dataNascimento) 
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de nascimento inválido. Use o formato DD/MM/YYYY.',
      })
    }
  }

  if (body.tipoPessoa === 'Jurídica' && !body.abertura) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Abertura é um campo obrigatório para pessoa jurídica.',
    })
  } else if (body.tipoPessoa === 'Jurídica' && body.abertura) {
    abertura = body.abertura
    try {
      abertura = convertToISO(body.abertura) 
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de abertura inválido. Use o formato DD/MM/YYYY.',
      })
    }

  }

  body.dataNascimento = dataNascimento;
  body.abertura = abertura;

  try {
    const fornecedorExistente = await prisma.fornecedor.findUnique({
      where: {
        id: Number(id), 
      }
    })

    if (!fornecedorExistente) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: {
        id: Number(id),
      },
      data: {
        ...body,
      }
    })

    return fornecedorAtualizado
  } catch (err) {
    
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar fornecedor' })
  }
})
