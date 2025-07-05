import prisma from '../prisma'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!
  const body = await readBody(event)

  if (isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID inválido.' })
  }

  let dataNascimento = null
  let abertura = null

  // Função para converter datas do formato BR para ISO
  const convertToISO = (dataBr: string) => {
    const [day, month, year] = dataBr.split('/').map(Number)
    if (!day || !month || !year) throw new Error('Data inválida')
    return new Date(year, month - 1, day).toISOString()
  }

  // Validação e conversão de datas
  if (body.tipoPessoa === 'Física' && body.dataNascimento) {
    try {
      dataNascimento = convertToISO(body.dataNascimento)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de nascimento inválido. Use o formato DD/MM/YYYY.',
      })
    }
  }

  if (body.tipoPessoa === 'Jurídica') {
    if (!body.abertura) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Abertura é um campo obrigatório para pessoa jurídica.',
      })
    }

    try {
      abertura = convertToISO(body.abertura)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Formato de data de abertura inválido. Use o formato DD/MM/YYYY.',
      })
    }
  }

  // Atualiza as datas convertidas no body
  body.dataNascimento = dataNascimento
  body.abertura = abertura

  // Normaliza CPF e CNPJ
  body.cpf = body.cpf?.replace(/\D/g, '') || null
  body.cnpj = body.cnpj?.replace(/\D/g, '') || null

  // Verificação de unicidade CNPJ
  if (body.tipoPessoa === 'Jurídica' && body.cnpj) {
    const outroComCnpj = await prisma.fornecedor.findFirst({
      where: {
        cnpj: body.cnpj,
        id: { not: Number(id) },
      },
    })

    if (outroComCnpj) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CNPJ já está em uso por outro fornecedor.',
      })
    }

    // Limpa campos de pessoa física
    body.cpf = null
    body.dataNascimento = null
  }

  // Verificação de unicidade CPF
  if (body.tipoPessoa === 'Física' && body.cpf) {
    const outroComCpf = await prisma.fornecedor.findFirst({
      where: {
        cpf: body.cpf,
        id: { not: Number(id) },
      },
    })

    if (outroComCpf) {
      throw createError({
        statusCode: 400,
        statusMessage: 'CPF já está em uso por outro fornecedor.',
      })
    }

    // Limpa campos de pessoa jurídica
    body.cnpj = null
    body.abertura = null
  }

  try {
    const fornecedorExistente = await prisma.fornecedor.findUnique({
      where: { id: Number(id) },
    })

    if (!fornecedorExistente) {
      throw createError({ statusCode: 404, statusMessage: 'Fornecedor não encontrado' })
    }

    const fornecedorAtualizado = await prisma.fornecedor.update({
      where: { id: Number(id) },
      data: { ...body },
    })

    return fornecedorAtualizado
  } catch (err) {
    console.error('Erro ao atualizar fornecedor:', err)
    throw createError({ statusCode: 500, statusMessage: 'Erro ao atualizar fornecedor.' })
  }
})
